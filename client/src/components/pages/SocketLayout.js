import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import io from "socket.io-client";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
// import { useDispatch, useSelector } from "../../store/store";
// import { useSelector, useDispatch } from 'react-redux'
// import { setLayout } from "../actions";
// import {
//   setLayoutState,
//   setSections,
// } from "../../store/slices/layoutSlice";

function SocketLayout() {
  
  const uuid = uuidv4();
  const [showJoinButton, setShowJoinButton] = useState(true);
  const [jsonData, setJsonData] = useState([
    {
      code: "y0",
      componentType: "ReactPlayer",
      props: {
        url: "https://youtu.be/bNxdUh4Ogwc?si=3-ZcpK6xD28E07IQ",
      },
    },
    {
      code: "y1",
      componentType: "ReactPlayer",
      props: {
        url: "https://youtu.be/h0Z231vS9rM",
      },
    },
    {
      code: "y2",
      componentType: "ReactPlayer",
      props: {
        url: "https://youtu.be/FMq7Rt1BJ68",
      },
    },
    {
      code: "y3",
      componentType: "ReactPlayer",
      props: {
        url: "https://youtu.be/RtFnoGPgwDs",
      },
    },
    {
      code: "y4",
      componentType: "ReactPlayer",
      props: {
        url: "https://youtu.be/o1SJ3Fa83jY",
      },
    },
    {
      code: "y5",
      componentType: "ReactPlayer",
      props: {
        url: "https://youtu.be/YwoidvCE52M?si=Obobbi-AzU5_HIva",
      },
    },
    {
      code: "i",
      componentType: "ProductImages",
      props: {
        cols: [4, 4, 4],
      },
    },
    {
      code: "p",
      componentType: "ProductCrousel",
      props: {
        cols: [3, 3, 3, 3],
      },
    },
    {
      code: "1",
      componentType: "Layout1",
      props: {
        title: "Layout1",
      },
    },
    {
      code: "2",
      componentType: "Layout2",
      props: {
        title: "Layout2",
      },
    },
  ]);
  const [sections, setSections] = useState([
    {
      title: "Paglipay AI Automation Agency",
      fluid: true,
      cols: ["3", "9"],
      // cols: ["z"],
      // featureTypesArry: ["2", "1", "c", "c"],
      featureTypesArry: ["1", "2"],
    },
    {
      title: "LGPTChatPal",
      fluid: true,
      cols: ["z", "z", "z"],
      featureTypesArry: ["p"],
    },
    {
      title: "Featured Images",
      fluid: true,
      cols: ["3", "3", "3", "3"],
      featureTypesArry: ["i", "i", "i", "i"],
    },
    {
      title: "My ChatGPT Interaction Showcase",
      fluid: true,
      cols: ["4", "4", "4"],
      featureTypesArry: ["y1", "y0", "y2", "y3", "y4", "y5"],
    },
  ]);
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("room1");
  //   const dispatch = useDispatch();
  //   const { sections } = useSelector(setLayou/tState);

  useEffect(() => {
    // Connect to Socket.IO server
    // const newSocket = io("http://192.168.2.203:3001"); // Replace with your server URL
    const newSocket = io.connect("/");
    setSocket(newSocket);
    // socket.current.on("yourID", (id) => {

    //     console.log('socket_id:', id)
    // })
    // joinRoom();
    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming layouts
      socket.on("layout", (layout) => {
        console.log("layout: ", layout);

        setJsonData(layout.layout.jsonData);
        setSections(layout.layout.sections);
      });
    }
  }, [socket]);

  const joinRoom = () => {
    console.log("joinRoom: ", room);
    setShowJoinButton(false);
    if (socket && room.trim() !== "") {
      socket.emit("join", {
        name: uuid + "-react",
        room: "room1",
      });
    }
  };

  //   const sendLayout = () => {
  //     if (socket) {
  //       socket.emit("customer layout", { room, layout: inputValue });
  //       setInputValue("");
  //     }
  //   };

  return (
    <>
      {showJoinButton && <Button onClick={joinRoom}>Join Room</Button>}
      <Layout jsonData={jsonData} sections={sections} />
    </>
  );
}

export default SocketLayout;
