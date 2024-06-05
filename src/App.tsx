import { useState } from 'react'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ClientScheduleAppt from "./pages/client/ClientScheduleAppt"
import ProviderSetSchedule from "./pages/provider/ProviderSetSchedule"
import ConfirmAppt from "./pages/client/ConfirmAppt"

function App() {
  const [schedule, setSchedule] = useState<Record<number, TimeBox[]>>({})
  const [bookings, setBookings] = useState<Record<number, Record<string, {id: number, confirmed: boolean, start: Date, end: Date}>>>({})

  const setScheduleWithChecks = (providerId: number, {start, end}: { start: Date, end: Date}) => {
    if(!schedule[providerId]?.length || (schedule[providerId] || []).some(({start: checkStart, end: checkEnd}) => { // make sure the new timebox doesn't collide with others
        const startVal = start.valueOf()
        const endVal = end.valueOf()
        const startCheckVal = checkStart.valueOf()
        const endCheckVal = checkEnd.valueOf()
        return !((startVal >= startCheckVal && startVal <= endCheckVal)
          || (endVal >= startCheckVal && endVal <= endCheckVal)
          || !(startVal < endVal)
          || (startVal < new Date().valueOf()))
        })) {
      setSchedule(prev => ({ ... prev, [providerId]: [...(prev[providerId] || []), {start, end}]} ))
  }}

  const bookAppt = (providerId: number, {start, end}: { start: Date, end: Date}) => {
    setBookings(prev => ({ ...prev, [providerId]: { ...prev[providerId], [`${start}-${end}`]: {id: 1, start, end, confirmed: false}}}))
  }

  const confirmAppt = (patientId: number, providerId: number, time: string) => {
    setBookings(prev => ({ ...prev, [providerId]: { ...prev[providerId], [time]: { ...prev[patientId]?.[time], confirmed: true}}}))
  }

  const router = createBrowserRouter([{
    path: "/",
    element: <ProviderSetSchedule schedule={schedule} setSchedule={setScheduleWithChecks} />,
  },{
      path: "/create-schedule/:providerId",
      element: <ProviderSetSchedule schedule={schedule} setSchedule={setScheduleWithChecks} />,
  }, {
      path: "/schedule-appt/:providerId",
      element: <ClientScheduleAppt schedule={schedule} bookings={bookings} bookAppt={bookAppt} />,
  },
  {
    path: "/confirm-appt/:patientId",
    element: <ConfirmAppt bookings={bookings} confirmAppt={confirmAppt} />,
}])


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
