import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import EventList from "./pages/EventList";
import Layout from "./pages/Layout";
import UpdateEvent from "./pages/UpdateEvent";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Pages with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"events/list"} />} />
        <Route path={`events`}>
          <Route path="list" element={<EventList />} />
          <Route path="create" element={<CreateEvent />} />
          <Route path={":eventID"} element={<EventDetail />} />
          <Route path="update">
            <Route path=":eventID" element={<UpdateEvent />} />
          </Route>
        </Route>
        <Route path="*" element={<>*</>} />
      </Route>
    </>
  )
);

const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
