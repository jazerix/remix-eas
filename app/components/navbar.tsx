import { Link } from "@remix-run/react";
import React from "react";

type Props = {
  children: JSX.Element;
};

export default function navbar({ children }: Props) {
  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 shadow-lg relative z-20">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" className="flex items-center">
            <svg
              className="h-8 text-indigo-600 fill-current"
              width="100%"
              height="100%"
              viewBox="0 0 301 106"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlSpace="preserve"
            >
              <g
                style={{ fillRule: "nonzero" }}
                transform="matrix(1,0,0,1,-208.01,-115.792)"
              >
                <g
                  style={{ fillRule: "nonzero" }}
                  transform="matrix(143.232,0,0,143.232,203.999,218.632)"
                >
                  <path d="M0.67,-0.546L0.697,-0.7L0.151,-0.7L0.028,-0L0.586,-0L0.614,-0.156L0.244,-0.156L0.266,-0.281L0.602,-0.281L0.628,-0.429L0.292,-0.429L0.312,-0.546L0.67,-0.546Z" />
                </g>
                <g
                  style={{ fillRule: "nonzero" }}
                  transform="matrix(143.232,0,0,143.232,300.108,218.632)"
                >
                  <path d="M0.577,-0L0.771,-0L0.581,-0.7L0.381,-0.7L-0.056,-0L0.163,-0L0.23,-0.115L0.55,-0.115L0.577,-0ZM0.459,-0.519L0.512,-0.281L0.325,-0.281L0.459,-0.519Z" />
                </g>
                <g
                  style={{ fillRule: "nonzero" }}
                  transform="matrix(143.232,0,0,143.232,413.547,218.632)"
                >
                  <path d="M0.307,0.018C0.506,0.018 0.636,-0.085 0.636,-0.24C0.636,-0.351 0.548,-0.421 0.39,-0.436C0.316,-0.443 0.28,-0.463 0.28,-0.498C0.28,-0.536 0.324,-0.56 0.395,-0.56C0.466,-0.56 0.52,-0.545 0.563,-0.513L0.665,-0.636C0.604,-0.688 0.514,-0.718 0.414,-0.718C0.227,-0.718 0.092,-0.616 0.092,-0.477C0.092,-0.357 0.169,-0.295 0.338,-0.278C0.412,-0.271 0.447,-0.252 0.447,-0.219C0.447,-0.177 0.395,-0.149 0.319,-0.149C0.236,-0.149 0.161,-0.175 0.112,-0.22L0.002,-0.091C0.073,-0.024 0.188,0.018 0.307,0.018Z" />
                </g>
              </g>
            </svg>
          </Link>
          <button
            data-collapse-toggle="mobile-menu"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <li>
                <Link
                  to={"/"}
                  className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  to={"devices"}
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0      "
                >
                  Registered Devices
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </>
  );
}
