import logo from "../assets/images/logo.jpg";

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour12: false,
};

const parseContent = (content) => {
  return content?.replace(/((#|@)\w*)/g, "<span data-blue='blue'>$1</span>");
};

const Card = ({ data }) => {

  const goToLink = (d) => {
    window.open(d.link);
  }

  return (
    <div className="card shadow" onSubmit={() => goToLink(data)} onClick={() => goToLink(data)}>
      <header>
        <img src={logo} alt="logo cdc" />
        <div className="header-text">
          <span>Caisses de grève</span>
          <br />
          <a href={data.link} target="_blanc">
            @caissedegreve
          </a>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 32 32"
        >
          <path
            style={{ transform: "translateY(-6px)" }}
            fill="#1D9BF0"
            d="M11.92 24.94A12.76 12.76 0 0 0 24.76 12.1v-.59A9.4 9.4 0 0 0 27 9.18a9.31 9.31 0 0 1-2.59.71 4.56 4.56 0 0 0 2-2.5 8.89 8.89 0 0 1-2.86 1.1 4.52 4.52 0 0 0-7.7 4.11 12.79 12.79 0 0 1-9.3-4.71 4.51 4.51 0 0 0 1.4 6 4.47 4.47 0 0 1-2-.56v.05a4.53 4.53 0 0 0 3.55 4.45 4.53 4.53 0 0 1-2 .08A4.51 4.51 0 0 0 11.68 21a9.05 9.05 0 0 1-5.61 2A9.77 9.77 0 0 1 5 22.91a12.77 12.77 0 0 0 6.92 2"
          />
        </svg>
      </header>
      <main className="main">
        <p dangerouslySetInnerHTML={{ __html: parseContent(data.content) }}></p>

        <div className="preview-container">
          <img className="preview" src={data.url} alt="image preview" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              style={{ transform: "scale(1.1) translate(-1px, -1px)" }}
              fill="currentColor"
              fillRule="evenodd"
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.306-6.154 4.72-2.787c.781-.462.781-1.656 0-2.118l-4.72-2.787C9.934 7.706 9 8.29 9 9.214v5.573c0 .923.934 1.507 1.694 1.059Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <time>
          {Intl.DateTimeFormat("fr-FR", options).format(
            new Date(data.createdAt)
          )}
        </time>
      </main>
      <hr />
      <section className="rs">
        <div className="likes">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
              fill="currentColor"
            />
          </svg>
          <span>{data.likes}</span>
        </div>
        <div className="rt">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="retweetIconTitle"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            color="currentColor"
          >
            <path d="M13 18L6 18L6 7" /> <path d="M3 9L6 6L9 9" />
            <path d="M11 6L18 6L18 17" /> <path d="M21 15L18 18L15 15" />
          </svg>
          <span>{data.retweets}</span>
        </div>
        <div className="rt, share">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z" fill="currentColor"/>
            </svg>
          <span>Partager</span>
        </div>
      </section>
      <button className="read-more">Lire les commentaires</button>
    </div>
  );
};

export default Card;
