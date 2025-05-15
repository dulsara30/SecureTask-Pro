import { Routes, Route, Navigate } from 'react-router-dom';
     import Login from './Login';
     import Home from './Home';

     function App() {
       return (
         <div className="min-h-screen bg-gray-100">
           <nav className="bg-blue-600 text-white p-4">
             <div className="container mx-auto flex justify-between">
               <h1 className="text-xl font-bold">SecureTask Pro</h1>
               <div>
                 <a href="/login" className="mr-4">Login</a>
                 {/* <a href="/login">Register</a> */}
               </div>
             </div>
           </nav>
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Login />} />
             <Route path="*" element={<Navigate to="/" />} />
           </Routes>
         </div>
       );
     }

     export default App;