import React, { useState, useEffect, lazy } from "react";
import { Col, Row, Container, Image, Form } from "react-bootstrap";
import DLayout from "./DLayout";

function LayoutRender(props) {
  
  const res = props.jsonData.reduce(
    (acc, curr, i) => (
      (acc[curr.code] = React.createElement(
        props.components[props.jsonData[i].componentType],
        props.jsonData[i].props
      )),
      acc
    ),
    {}
  );

  const [featureTypes, setFeatureTypes] = useState({});
  const [features, setFeatures] = useState([]);
  const [featureTypesArry, setFeatureTypesArry] = useState([]);
  const [cols, setCols] = useState([]);

  useEffect(() => {
    setFeatureTypes(res);
    setFeatureTypesArry(props.featureTypesArry);
    setCols(props.cols);
  }, [props]);

  useEffect(() => {
    setFeatures(featureTypesArry.map((e) => featureTypes[e]));
  }, [featureTypesArry]);

  return (
    <>      
      <Container
        fluid={props.fluid}
        // style={{ backgroundColor: 'white', padding: '25px', marginBottom: '25px' }}
      >
        <DLayout cols={cols} features={features} dname={"section1"} />
      </Container>
    </>
  );
}

export default LayoutRender;
