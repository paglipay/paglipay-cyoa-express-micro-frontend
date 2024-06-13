import React, { useState } from "react";
import Layout from "../Layout";
// import { useDispatch, useSelector } from "../../store/store";
// import { useSelector, useDispatch } from 'react-redux'
// import { setLayout } from "../actions";
// import {
//   setLayoutState,
//   setSections,
// } from "../../store/slices/layoutSlice";

function Layout1() {
//   const dispatch = useDispatch();
//   const { sections } = useSelector(setLayou/tState);
  return (
    <>
      <Layout
        jsonData={[
          {
            code: "c",
            componentType: "AiChat",
            props: {
              title: "AiChat",
            },
          },
          {
            code: "i",
            componentType: "ProductImages",
            props: {
              cols: [4, 4, 4],
            },
          },
        ]}
        sections={[
          {
            title: "Nav1",
            fluid: true,
            cols: ["z","z"],
            featureTypesArry: ["i","i"],
          },
          {
            title: "Nav2",
            fluid: true,
            cols: ["z"],
            featureTypesArry: ["i"],
          },
        ]}
      />
    </>
  );
}

export default Layout1;
