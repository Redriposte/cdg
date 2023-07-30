import { useRef } from 'react';
import CreatableSelect from "react-select/creatable";
import FilterIcon from "./icons/FilterIcon";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Fuse from "fuse.js";
import orderBy from "lodash/orderBy";
import slice from "lodash/slice";
import Card from "./Card";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "@taak/react-modern-calendar-datepicker";
import isWithinInterval from "date-fns/isWithinInterval";
import { format, addDays } from "date-fns";
import data from "../../data.json";

const myCustomLocale = {
  // months list by order
  months: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],

  // week days by order
  weekDays: [
    {
      name: "Dimanche", // used for accessibility
      short: "D", // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
    {
      name: "Lundi",
      short: "L",
    },
    {
      name: "Mardi",
      short: "M",
    },
    {
      name: "Mercredi",
      short: "M",
    },
    {
      name: "Jeudi",
      short: "J",
    },
    {
      name: "Vendredi",
      short: "V",
    },
    {
      name: "Samedi",
      short: "S",
      isWeekend: true,
    },
  ],

  // just play around with this number between 0 and 6
  weekStartingIndex: 0,

  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },

  // return a native JavaScript date here
  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },

  // return a number for date's month length
  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },

  // return a transformed digit to your locale
  transformDigit(digit) {
    return digit;
  },

  // texts in the date picker
  nextMonth: "Mois suivant",
  previousMonth: "Mois précédent",
  openMonthSelector: "Ouvrir Mois Sélection",
  openYearSelector: "Ouvrir Année Sélection",
  closeMonthSelector: "Fermer Mois Sélection",
  closeYearSelector: "Fermer Année Sélection",
  defaultPlaceholder: "Sélection...",

  // for input range value
  from: "Du",
  to: "au",

  // used for input value when multi dates are selected
  digitSeparator: ",",

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: false,
};

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "50px",
    paddingLeft: "40px",
    paddingRight: "15px",
    height: "50px",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? "red" : "blue",
      color: "#FFF",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: data.value.startsWith('#') ? '#FADFDC' : data.value.startsWith('@') ? '#F5B09B' : '#eaebec',
    };
  },
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: "#1D9BF0",
      color: 'white',
    },
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    textOverflow: "ellipsis",
    maxWidth: "90%",
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),
};

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
    : Math.sign(num) * Math.abs(num);
}

const fuseOptions = {
  includeScore: true,
  keys: ["names", "content", "hashtags"],
  useExtendedSearch: true,
  minMatchCharLength: 4,
  isCaseSensitive: false,
  shouldSort: true,
  threshold: 0.5,
};

const Body = () => {
  const creatableSelectInputRef = useRef(null);
  const [dataJsonRaw, setDataJsonRaw] = useState([{
    tweets: data[0].tweets.sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime())
  }]);
  const [dataJson, setDataJson] = useState(data);

  const [searchWordsList, setSearchWordsList] = useState("");
  const [orderByLikes, setOrderByLikes] = useState(false);
  const [orderByRT, setOrderByRT] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });

  const getInputValues = (values) => {
    if (values) {
      const searchWords = values.map((v) => v.value.replace(/\s/g, '')).join("|");
      setOrderByLikes(false);
      setOrderByRT(false);

      setSearchWordsList((s) => searchWords);
      searchGenerator(searchWords, selectedDayRange);
      if(searchWords === '') {
        setSelectedDayRange({
          from: null,
          to: null,
        })
      }
    } else {
      setDataJson((s) => dataJsonRaw);
    }
  };

  const searchGenerator = (searchTerms, date) => {
    const searchTermsEmpty = searchTerms === '';
    const dateIsEmpty = date.from === null || date.to === null;
    const fuse = new Fuse(data[0].tweets, fuseOptions);

    let result = [];

    if(searchTermsEmpty && dateIsEmpty) {
      result = [{ tweets: data[0].tweets.sort((a, b) => b-a) }];
    }

    if(!searchTermsEmpty && dateIsEmpty) {
      const resultFromFuse = fuse.search(searchTerms).map((r) => ({...r.item, score: r.score}));
      result = [{ tweets: resultFromFuse.sort((a, b) => b-a) }];
    }

    if(searchTermsEmpty && !dateIsEmpty) {
      const resultFilteredByDate = [{ tweets: data[0].tweets.sort((a, b) => b-a) }][0].tweets.filter((t) => {
        return isWithinInterval(new Date(t.createdAt), {
          start: new Date(`${date.from.year}-${date.from.month}-${date.from.day}`),
          end: new Date(`${date.to.year}-${date.to.month}-${date.to.day === 31 ? 30 : date.to.day + 1}`),
        });
      });
      result = [{ tweets: resultFilteredByDate.sort((a, b) => b-a) }];
    }

    if(!searchTermsEmpty && !dateIsEmpty) {
      const resultFromFuse = fuse.search(searchTerms).map((r) => ({...r.item, score: r.score}));
      const resultFilteredByTermsAndDate = [{ tweets: resultFromFuse.sort((a, b) => b-a) }][0].tweets.filter((t) => {
        return isWithinInterval(new Date(t.createdAt), {
          start: new Date(`${date.from.year}-${date.from.month}-${date.from.day}`),
          end: new Date(`${date.to.year}-${date.to.month}-${date.to.day === 31 ? 30 : date.to.day + 1}`),
        });
      });
      result = [{ tweets: resultFilteredByTermsAndDate.sort((a, b) => b-a) }];
    }

    setDataJson((s) => result);
    resetPage();
  }

  useEffect(() => {
    searchGenerator(searchWordsList, selectedDayRange);
  }, [searchWordsList, selectedDayRange]);

  const reorderByLikes = (v) => {
    const b = (v = !v);
    setOrderByRT(false);
    if (dataJson[0].tweets.length === data[0].tweets.length) {
      if(b) {
        setDataJson((s) => [
          { tweets: orderBy(dataJsonRaw[0].tweets, "likes", "desc") },
        ]);
      } else {
        setDataJson((s) => [
          { tweets: dataJsonRaw[0].tweets.sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime()) },
        ]);
      }
    } else {
        if (b) {
          setDataJson((s) => [
            { tweets: orderBy(dataJson[0].tweets, "likes", "desc") },
          ]);
        } else {
          searchGenerator(searchWordsList, selectedDayRange);
        }
    }
    setOrderByLikes(b);
  };

  const reorderByRT = (v) => {
    const b = (v = !v);
    setOrderByLikes(false);
    if (dataJson[0].tweets.length === data[0].tweets.length) {
      if(b) {
        setDataJson((s) => [
          { tweets: orderBy(dataJsonRaw[0].tweets, "retweets", "desc") },
        ]);
      } else {
        setDataJson((s) => [
          { tweets: dataJsonRaw[0].tweets.sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime()) },
        ]);
      }
    } else {
        if (b) {
          setDataJson((s) => [
            { tweets: orderBy(dataJson[0].tweets, "retweets", "desc") },
          ]);
        } else {
          searchGenerator(searchWordsList, selectedDayRange);
        }
    }
    setOrderByRT(b);
  };

  const getCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(0);
  };

  const resetAll = () => {
    setSelectedDayRange({
      from: null,
      to: null,
    });
    setOrderByLikes(false);
    setOrderByRT(false);
    if(creatableSelectInputRef?.current) {
      creatableSelectInputRef.current.clearValue()
    }
    setDataJsonRaw([{
      tweets: data[0].tweets.sort((d1, d2) => new Date(d2.createdAt).getTime() - new Date(d1.createdAt).getTime())
    }]);
    setCurrentPage(0);
  };

  const filterByDate = (d) => {
    searchGenerator(searchWordsList, d);
    setSelectedDayRange(d);
  };

  return (
    <main className="body">
      <header className="body__header">
        <h1>
          Fabricant d'armes (plus ou moins létales) à destination des réseaux
          sociaux.
        </h1>
        <h2>
          Moteur de recherche des tweets de{" "}
          <span className="highlight">Caisses de grève.</span>
        </h2>
      </header>
      <section className="body__search">
        <div className="body__search__input shadow">
          <div className="body__search__input__icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_86)">
                <path
                  d="M14.6667 14.6667L13.3333 13.3333M7.66668 14C8.49838 14 9.32194 13.8362 10.0903 13.5179C10.8587 13.1996 11.5569 12.7331 12.145 12.145C12.7331 11.5569 13.1996 10.8587 13.5179 10.0903C13.8362 9.32193 14 8.49837 14 7.66666C14 6.83496 13.8362 6.01139 13.5179 5.243C13.1996 4.4746 12.7331 3.77642 12.145 3.18832C11.5569 2.60021 10.8587 2.1337 10.0903 1.81542C9.32194 1.49714 8.49838 1.33333 7.66668 1.33333C5.98697 1.33333 4.37606 2.00059 3.18833 3.18832C2.0006 4.37605 1.33334 5.98696 1.33334 7.66666C1.33334 9.34637 2.0006 10.9573 3.18833 12.145C4.37606 13.3327 5.98697 14 7.66668 14Z"
                  stroke="currentColor"
                  strokeOpacity="0.75"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_86">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <CreatableSelect
            onChange={(values) => {
              const nValues = values.map((v) => {
                return { ...v, isHashtag: v.value.startsWith("#") };
              });
              getInputValues(nValues);
            }}
            ref={creatableSelectInputRef}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={colourStyles}
            isMulti
            components={{
              Menu: () => null, // Remove menu
              MenuList: () => null, // Remove menu list
              DropdownIndicator: () => null, // Remove dropdown icon
              IndicatorSeparator: () => null, // Remove separator
            }}
            placeholder="Recherche par nom, prénom, hashtag..."
          />
        </div>
        <DatePicker
          value={selectedDayRange}
          onChange={filterByDate}
          inputPlaceholder="Filtrer par date"
          locale={myCustomLocale}
          colorPrimary="var(--blue)" // added this
          colorPrimaryLight="var(--light-gray)"
          maximumDate={{
            year: format(addDays(new Date(), 1), "yyyy"),
            month: format(addDays(new Date(), 1), "MM"),
            day: format(addDays(new Date(), 1), "dd"),
          }}
          formatInputText={() => {
            if (selectedDayRange?.from && selectedDayRange?.to) {
              return `Du ${selectedDayRange?.from.day}/${selectedDayRange?.from.month}/${selectedDayRange?.from.year} au ${selectedDayRange?.to.day}/${selectedDayRange?.to.month}/${selectedDayRange?.to.year}`;
            }
          }}
          customDaysClassName={[
            ...new Set(data[0].tweets.map((t) => t.createdAt).flat()),
          ].map((date) => {
            const ndate = date.split("T")[0];
            return {
              year: Number(ndate.split("-")[0]),
              month: Number(ndate.split("-")[1]),
              day: Number(ndate.split("-")[2]),
              className: "blueDay",
            };
          })}
          renderFooter={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem 2rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  resetAll();
                }}
                style={{
                  border: "1px solid var(--blue)",
                  color: "var(--blue)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 2rem",
                  fontSize: "0.9rem",
                }}
              >
                Réinitialiser !
              </button>
            </div>
          )}
        />
        <div className="totals">
          <hr className="head-hr" />
          <div className="total-likes">
            <svg
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.7188 13.5V16.875C15.3934 16.875 13.5 18.7667 13.5 21.0938H10.125C10.125 16.9071 13.5321 13.5 17.7188 13.5Z"
                fill="currentColor"
              />
              <path
                d="M36.2812 8.4375C32.7105 8.4375 29.3743 9.92419 27 12.4976C24.6257 9.92419 21.2895 8.4375 17.7188 8.4375C10.7392 8.4375 5.0625 14.0619 5.0625 21.0938C5.0625 36.3521 27 45.5625 27 45.5625C27 45.5625 48.9375 36.3521 48.9375 21.0938C48.9375 14.0619 43.2607 8.4375 36.2812 8.4375ZM27 41.8449C22.5754 39.6917 8.4375 31.9579 8.4375 21.0938C8.4375 15.9756 12.6006 11.8125 17.7188 11.8125C20.3344 11.8125 22.7509 12.8689 24.5194 14.7859L25.7597 16.1308H28.2403L29.4806 14.7859C31.2491 12.8689 33.6656 11.8125 36.2812 11.8125C41.3994 11.8125 45.5625 15.9756 45.5625 21.0938C45.5625 31.9579 31.4246 39.6917 27 41.8449Z"
                fill="currentColor"
              />
            </svg>
            <div className="total-likes-content">
              Total likes
              <p>
                {kFormatter(
                  data[0].tweets.reduce((acc, t) => acc + t.likes, 0)
                )}
              </p>
            </div>
          </div>
          <hr className="head-hr" />
          <div className="total-rt">
            <svg
              width="52"
              height="37"
              viewBox="0 0 52 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34 26.2857L42 34.3809L50 26.2857"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.3333 2H31.3333C37.2244 2 42 6.83248 42 12.7936V34.3809"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 10.0952L10 2L2 10.0952"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28.6667 34.3809H20.6667C14.7756 34.3809 10 29.5485 10 23.5873V2"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="total-likes-content">
              Total RT
              <p>
                {kFormatter(
                  data[0].tweets.reduce((acc, t) => acc + t.retweets, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="body__filters">
        <h2>Listes des Tweets.</h2>
        <ul>
          <li>
            <button
              darkhover="true"
              onClick={() => reorderByLikes(orderByLikes)}
              className={orderByLikes ? "active" : ""}
            >
              <FilterIcon /> Likes
            </button>
          </li>
          <li>
            <button
              darkhover="true"
              onClick={() => reorderByRT(orderByRT)}
              className={orderByRT ? "active" : ""}
            >
              <FilterIcon order="desc" /> Retweets
            </button>
          </li>
          {
            dataJson[0].tweets.length >= 0 &&
            dataJson[0].tweets.length !== data[0].tweets.length && (
              <li>
                <button darkhover="true" className="btn-result" onClick={() => resetAll()}>
                  {dataJson[0].tweets.length} Résultat{dataJson[0].tweets.length > 1 ? 's' : ''}
                </button>
              </li>
            )}
          {searchWordsList !== "" &&
            dataJson[0].tweets.length === data[0].tweets.length && (
              <li>
                <button darkhover="true" className="btn-result" onClick={() => resetAll()} >0 Résultat</button>
              </li>
            )}
        </ul>
      </section>
      <PaginatedItems
        itemsPerPage={itemsPerPage}
        getCurrentPage={getCurrentPage}
        totalPage={dataJson[0].tweets.length}
        currentPage={currentPage}
      >
        <section className="body__tweets">
          {slice(
            dataJson[0].tweets.map((c) => <Card key={c.id} data={c} />),
            currentPage * itemsPerPage,
            currentPage * itemsPerPage + itemsPerPage
          )}
        </section>
      </PaginatedItems>

      {dataJson[0].tweets.length === 0 && (
        <section className="reset-section">
          Aucun résultat pour cette recherche{" "}
          <button className="btn reset" onClick={() => resetAll()}>
            Réinitialiser les filtres
          </button>
        </section>
      )}
    </main>
  );
};

function PaginatedItems({
  children,
  itemsPerPage,
  getCurrentPage,
  totalPage,
  currentPage,
}) {
  // We start with an empty list of items.
  // const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(
    Math.ceil(totalPage / itemsPerPage)
  );
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setPageCount(Math.ceil(totalPage / itemsPerPage));
  }, [itemOffset, itemsPerPage, totalPage, currentPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % totalPage;
    getCurrentPage(event.selected);
    setItemOffset(newOffset);
  };

  return (
    <>
      <ReactPaginate
        previousLabel="⇠"
        nextLabel="⇢"
        onPageChange={handlePageClick}
        pageRangeDisplayed={0}
        marginPagesDisplayed={0}
        pageCount={pageCount}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={currentPage}
      />
      {children}
    </>
  );
}

export default Body;
