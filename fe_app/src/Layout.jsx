import React from "react";
import Header from "./Header";


const MainLayout = ({ children }) => (
    <section className='layout'>
        <aside className='sidebar' />
        <section>
            <Header />
            <main>
                {children}
            </main>
        </section>
    </section>
);
export default MainLayout;