import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import OverviewPage from "./pages/OverViewPage.jsx";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage.jsx/index.js";
import OrdersPage from "./pages/OrdersPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='/customers' element={<UsersPage />} />
				<Route path='/sales' element={<SalesPage />} />
				<Route path='/orders' element={<OrdersPage />} />
			</Routes>
		</div>
	);
}

export default App;
