import React, { useState } from "react";
import Layout from "../Layout";
function Layout1() {
  return (
    <>
      <Layout
        jsonData={[
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
        ]}
        sections={[
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
        ]}
      />
    </>
  );
}

export default Layout1;
