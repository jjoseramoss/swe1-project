import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


const Home = () => {
    return(
        <div className="h-[calc(100vh-4rem)] flex flex-col pt-8">
            <div className="flex gap-10 justify-center h-40">      
                <figure className= "flex flex-col items-center w-full justify-center">
                    <img src="/tempLogo.jpg" alt="game image" className="h-full w-auto"/>
                    <h1 className="text-primary text-4xl font-bold">Know Me Game</h1>
                </figure>
            </div>    

        {/*Add Main Home Page Content Below*/}
            <div className="h-screen flex gap-10 justify-center pt-10">
                <div className="card flex items-center bg-primary w-150 h-150 shadow-sm">
                     <Link to="/main" className="btn btn-success mt-2 w-140">Login</Link>           
                </div>
                <div className="card bg-primary w-150 h-150 shadow-sm">
                    
                </div>
            </div>
            

        </div>
        
    )
}


export default Home