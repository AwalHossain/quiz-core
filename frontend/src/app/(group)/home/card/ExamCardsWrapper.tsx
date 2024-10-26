// 'use client'

// import { useAuth } from "@/context/AuthProvider";
// import { Exam } from "@/interface/constants";
// import { getAllExam } from "@/services/session";
// import { useEffect, useState } from "react";
// import ExamCards from "./ExamCards";

// const ExamCardsWrapper = () => {
//   const { user } = useAuth();
//   const [data, setData] = useState<Exam[]>([]);
//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getAllExam({ userId: user?.userId || "" });
//       setData(data.data);
//     }
//     fetchData();
//   }, [user?.userId]);

//   console.log(data, "data");
//   return (

//     <ExamCards questions={data} userId={user?.userId || ""} />
//   );
// }

// export default ExamCardsWrapper;
