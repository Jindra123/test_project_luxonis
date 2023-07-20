import React from 'react';
import PaginatedItems from "./components/paginatedItems";

const App = () => {

  return (
    <div className="grid place-items-center my-10 mx-2">
        <h1 className="mb-8 text-3xl font-extrabold leading-none tracking-tight text-black md:text-5xl lg:text-6xl">Best apartments <span
                className="underline underline-offset-3 decoration-8 decoration-purple">in Czech</span>
        </h1>
        <PaginatedItems itemsPerPage={8} />
    </div>
  );
}

export default App;
