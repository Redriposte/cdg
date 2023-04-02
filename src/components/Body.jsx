import CreatableSelect from "react-select/creatable";

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
    overflow: "hidden"
  }),
};

const Body = () => {
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
                  stroke="#7F8C9B"
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
      </section>
    </main>
  );
};

export default Body;
