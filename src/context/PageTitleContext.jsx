import { createContext, useContext, useState } from "react";

const PageTitleContext = createContext();

export const usePageTitle = () => useContext(PageTitleContext);

export default function PageTitleProvider({ children }) {
    const [title, setTitle] = useState("");
    return (
        <PageTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
}