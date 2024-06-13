import React, { useState } from "react";
import LayoutRender from "./LayoutRender";

// import { useDispatch, useSelector } from "../store/store";
// import {
//   getLayoutState,
// } from "../store/slices/layoutSlice";

const Layout = (props) => {
  const components = {
    "ReactPlayer": require("./ReactPlayer/MyReactPlayer").default,
    "ProductImages": require("./ProductImages").default,
    "ProductCrousel": require("./ProductCrousel").default,
    "AiChat": require("./AiChat/AiChat").default,
    "Layout1": require("./pages/Layout1").default,
    "Layout2": require("./pages/Layout2").default,
  };

  // const { jsonData, sections } = useSelector(getLayoutState);
  const { jsonData, sections } = props;

  return (
    <>
      {sections.map((e, i) => (
        <div key={`div-${i}`}>
          <section
            key={`prl-sec-${i}`}
            style={{
              backgroundColor: "whitesmoke",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h3 key={`prl-sec-h3-${i}`}>{e.title}</h3>
          </section>
          <LayoutRender
            key={`prl-${i}`}
            components={components}
            jsonData={jsonData}
            cols={e.cols}
            featureTypesArry={e.featureTypesArry}
            fluid={e.fluid}
          />
        </div>
      ))}
    </>
  );
};

export default Layout;
