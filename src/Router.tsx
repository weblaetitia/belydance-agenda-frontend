import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent";
import EventList from "./pages/EventList";
import Layout from "./pages/Layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Pages with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"event-list"} />} />
        <Route path="/event-list" element={<EventList />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="*" element={<>*</>} />
      </Route>
    </>
  )
);

const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
