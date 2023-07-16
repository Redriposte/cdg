import CreatableSelect from "react-select/creatable";
import FilterIcon from "./icons/FilterIcon";
import { useState, useEffect } from "react";
import Fuse from 'fuse.js';
import Card from "./Card";
import data from '../../data.json';

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
      backgroundColor: isDisabled ? "red" : blue,
      color: "#FFF",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
  valueContainer: (provided, state) => ({
    ...provided,
    textOverflow: "ellipsis",
    maxWidth: "90%",
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),
};

function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}

const fuseOptions = {
  includeScore: true,
  keys: ['hashtags', 'names', 'content', 'dates', 'createdAt'],
  useExtendedSearch: true,
  minMatchCharLength: 4,
  isCaseSensitive: false,
  shouldSort: true,
  threshold: 0.6
}

const Body = () => {
  const [dataJsonRaw, setDataJsonRaw] = useState(data);
  const [dataJson, setDataJson] = useState(data);
  const [searchWordsList, setSearchWordsList] = useState('');

  const getInputValues = (values) => {
    if (values) {
      const searchWords = values.map(v => v.value).join(' | ');
      setSearchWordsList(s => searchWords);
    }
  }

  const fuseSearchTerms = (searchTerms) => {
    if (searchTerms) {
      const fuse = new Fuse(dataJson[0].tweets, fuseOptions);
      const result = fuse.search(searchTerms).map(r => r.item);
      if(result.length > 0) {
        setDataJson(s => [ { "tweets": result } ]);
      } else {
        setDataJson(s => dataJsonRaw);
      }
    } else {
      setDataJson(s => dataJsonRaw);
    }
 }

  useEffect(() => {
    fuseSearchTerms(searchWordsList);
  }, [searchWordsList])



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
              const nValues = values.map(v => {
                return {...v, isHashtag: v.value.startsWith('#')};
              });
              getInputValues(nValues);
            }}
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
        <button className="btn btn-search shadow">Rechercher</button>
        <div className="totals">
          <hr className="head-hr" />
          <div className="total-likes">
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.7188 13.5V16.875C15.3934 16.875 13.5 18.7667 13.5 21.0938H10.125C10.125 16.9071 13.5321 13.5 17.7188 13.5Z" fill="currentColor"/>
              <path d="M36.2812 8.4375C32.7105 8.4375 29.3743 9.92419 27 12.4976C24.6257 9.92419 21.2895 8.4375 17.7188 8.4375C10.7392 8.4375 5.0625 14.0619 5.0625 21.0938C5.0625 36.3521 27 45.5625 27 45.5625C27 45.5625 48.9375 36.3521 48.9375 21.0938C48.9375 14.0619 43.2607 8.4375 36.2812 8.4375ZM27 41.8449C22.5754 39.6917 8.4375 31.9579 8.4375 21.0938C8.4375 15.9756 12.6006 11.8125 17.7188 11.8125C20.3344 11.8125 22.7509 12.8689 24.5194 14.7859L25.7597 16.1308H28.2403L29.4806 14.7859C31.2491 12.8689 33.6656 11.8125 36.2812 11.8125C41.3994 11.8125 45.5625 15.9756 45.5625 21.0938C45.5625 31.9579 31.4246 39.6917 27 41.8449Z" fill="currentColor"/>
            </svg>
            <div className="total-likes-content">
              Total likes
              <p>{kFormatter(dataJson[0].tweets.reduce((acc, t) => acc + t.likes, 0))}</p>
            </div>
          </div>
          <hr className="head-hr" />
          <div className="total-rt">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34 26.2857L42 34.3809L50 26.2857" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23.3333 2H31.3333C37.2244 2 42 6.83248 42 12.7936V34.3809" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 10.0952L10 2L2 10.0952" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28.6667 34.3809H20.6667C14.7756 34.3809 10 29.5485 10 23.5873V2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="total-likes-content">
              Total RT
              <p>{kFormatter(dataJson[0].tweets.reduce((acc, t) => acc + t.retweets, 0))}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="body__filters">
        <h2>Listes des Tweets.</h2>
        <ul>
          <li>
            <button darkhover="true">
              <FilterIcon order="desc" /> Likes
            </button>
          </li>
          <li>
            <button darkhover="true">
              <FilterIcon order="desc" /> Retweets
            </button>
          </li>
        </ul>
      </section>
      <section className="body__tweets">
            { dataJson[0].tweets.map(c => <Card key={c.id} data={c} />) }
      </section>
    </main>
  );
};

export default Body;
