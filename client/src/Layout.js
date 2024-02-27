import { Outlet } from "react-router-dom";
import Header from "./Header";
//In react-router-dom, an Outlet is a component that acts as a placeholder for the content that should be rendered based on the nested routes defined within its parent route. It's used when you have nested routes, and it serves as the insertion point for the child components rendered by those nested routes.
export default function Layout()
{
    return(
        <main>
            <Header />
            <Outlet />
        </main>
    );
}