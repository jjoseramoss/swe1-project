import {useState} from "react";

interface Themes{
    index: number;
    currentTheme: string;
    themes: string[];
}

const ChangeTheme = () => {

    const [theme, setTheme] = useState<Themes>({
        index: 0,
        currentTheme: "cupcake",
        themes: ["cupcake", "dark", "forest", "retro"],
    })

    const nextTheme = () => {
        const nextIndex = (theme.index + 1) % 4;
        const newTheme = theme.themes[nextIndex];
        setTheme({
            ...theme,
            index: nextIndex,
            currentTheme: newTheme,
        });
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return(
        <button className="btn btn-primary" onClick={nextTheme}>Change Theme</button> 
    );

};

export default ChangeTheme;