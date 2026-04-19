import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "@/store/index";
import { router } from "@/routes/index";

/**
 * Global App entry point.
 * Focuses on providing global state (Redux) and navigation (React Router) providers.
 */
const App = () => (
   <Provider store={store}>
      <RouterProvider router={router} />
   </Provider>
);

export default App;
