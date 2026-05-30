import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import ErrorPage from "./routes/erroPage.jsx";
import Home from "./routes/home";
import Contato from './routes/contato.jsx';
import Blog from './pages/Blog.jsx';
import MinhaConta from './routes/minhaConta.jsx';
import Carrinho from './routes/carrinho.jsx';
import Produtos from './routes/produtos.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Login from "./pages/Login.jsx";
import Sobre from './routes/sobre.jsx';
import { UserProvider } from './componentes/userContext.jsx';
import PrivateRoute from "./componentes/privateRoutes.jsx";
import Fornecedor from './routes/Fornecedor.jsx';
import DadosContato from './routes/DadosContato.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    // 4 - componente base para páginas
    children: [
      {
        path: "/",
        element: <Cadastro />,
      },
      {
        path: "contato",
        element: <Contato />,
      },
      {
        path: "blog",
        element:  <Blog />,
      },
      {
        path: "minhaConta",
        element: <PrivateRoute> <MinhaConta /></PrivateRoute>,
      },
      {
        path: "carrinho",
        element: <PrivateRoute> <Carrinho /> </PrivateRoute>,
      },
       {
        path: "produtos/:id",
        element: <Produtos />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "sobre",
        element: <Sobre />,
      },
      {
        path: "Fornecedor",
        element: <PrivateRoute> <Fornecedor /> </PrivateRoute>
      },
      {
        path: "DadosContato",
        element: <PrivateRoute> <DadosContato/> </PrivateRoute>
      }
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
