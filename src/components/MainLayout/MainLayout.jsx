import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";

import PageTitleProvider from "../../context/PageTitleContext.jsx";

export default function MainLayout(){

    return (
        <>
            <PageTitleProvider>
                <div className={'dashboard__screen'}>
                    <Header/>
                    <div className={'container'}>
                        <Navbar/>
                        <Outlet/>
                    </div>
                </div>
            </PageTitleProvider>
        </>
    )
}