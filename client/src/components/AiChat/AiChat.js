import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import {
  Alert,
  Button,
  Form,
  Row,
  Col,
  Image,
  Card,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function AiChat(props) {
  const [consolelog, setConsolelog] = useState("");
  const [message, setMessage] = useState([
    <p key={"i"} style={{ textAlign: "center" }}>
      {/* <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body> */}
      <Image src={`${props.image}`}></Image>
      {/* <ReactPlayer url="https://youtu.be/o1SJ3Fa83jY" controls={true} /> */}
      {/* </Card.Body>
      </Card> */}
    </p>,
  ]);

  const [prompt, setPrompt] = useState("");
  const [conversationHistory, setConversationHistory] = useState(
    props.conversationHistory
  );
  const { speak } = useSpeechSynthesis();
  const [acceptedCommand, setAcceptedCommand] = useState("");
  const [commands, setCommands] = useState([]);
  const [commandButtons, setCommandButtons] = useState([]);
  const [repeatCommand, setRepeatCommand] = useState(true);
  const [debug, setDebug] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showPromptBox, setShowPromptBox] = useState(true);
  const [badgeStatus, setBadgeStatus] = useState("danger");
  const [appUuid, setAppUuid] = useState("");
  const [speakText, setSpeakText] = useState({ text: "" });
  const start = async (e_ary) => {
    const uuid = uuidv4();
    const new_cmds = await e_ary.map((e) => {
      return {
        command: e.split("/").pop(),
        callback: async () => {
          setAcceptedCommand(e);
          if (e === "computer") {
            const audio = new Audio("./computerbeep_50.mp3");
            await audio.play();
          }
          await listenStop();
          //   setMessage(`You said ${e}.`);
          repeatCommand &&
            speak({ text: `${debug ? e : e.split("/").pop()}.` });
          await axios
            .post(
              `https://automate.paglipay.info/start/${uuid}:${e
                .split("/")
                .pop()}`,
              // `http://192.168.2.213:5000/start/${uuid}:${e.split("/").pop()}`,
              // `https://paglipay-dtree.herokuapp.com/start/${uuid}:${e.split("/").pop()}`,
              {
                jobs: [
                  {
                    import: "Key",
                  },
                  {
                    True: [`./my_packages/VoiceCmdObj/${e}/_create_list.json`],
                  },
                  {
                    True: [`./my_packages/VoiceCmdObj/${e}/out.json`],
                  },
                ],
              }
            )
            .then(async (res) => {
              console.log(res);
              // await listenStop();

              if (res.data.hasOwnProperty("VoiceCmdObj" === false)) {
                speak({
                  text: "I am aware of this command, but I do not yet have an action for it. Would you like to create one?",
                });

                start(["create command", e]);
              }

              await speak({
                text: res.data["VoiceCmdObj"].slice(0, 1).join(".\n "),
                // voice: voices[4],
              });
              await start(res.data["VoiceCmdObj"]);
            })
            .catch(async (res) => {
              console.log(res);
              await speak({
                text: "Sorry, there appears to be an issue connecting to the server.",
              });
            });
        },
      };
    });

    setCommands(new_cmds.filter((f) => f["command"] !== ""));
  };

  useEffect(() => {
    setAppUuid(uuidv4());
  }, []);

  useEffect(() => {
    if (speakText["text"] != "") {
      speak(speakText);
    }
  }, [speakText]);

  const cpTranscriptToPrompt = async (e) => {
    e.preventDefault();
    if (prompt == "") {
      setPrompt(transcript);
    }
    listenStop();
  };

  useEffect(() => {
    console.log("appUuid", appUuid);
  }, [appUuid]);

  const sendPrompt = async (e) => {
    await e.preventDefault();
    listenStop();
    setShowSpinner(true);

    const uuid = uuidv4();
    // await sendToApi(prompt, uuid, "generate_image");
    sendToApi(prompt, uuid);
  };

  const sendTranscript = async (e) => {
    await e.preventDefault();
    listenStop();
    setShowSpinner(true);
    const uuid = uuidv4();
    // await sendToApi(transcript, uuid, "generate_image");
    sendToApi(transcript, uuid);
  };
  const getImage = async (prompt, uuid, convoHistory, position) => {
    console.log("convoHistory: ", convoHistory);
    setShowSpinner(true);
    await axios
      // .post(`https://automate.paglipay.info/start/${appUuid}`, {
      // .post(`http://192.168.2.213:5000/start/${appUuid}`, {
      .post(`https://paglipay-dtree.herokuapp.com/start/${appUuid}`, {
        // .post(`https://paglipay-fastapi.herokuapp.com/start/${appUuid}`, {
        jobs: [
          {
            import: "Key",
          },
          {
            True: [
              {
                import: "RequestsObj",
              },
              {
                open: {
                  ip: "https://automate.paglipay.info/start",
                  jobs: [
                    {
                      import: "Key",
                    },
                    {
                      True: [
                        {
                          import: "RequestsObj",
                        },
                        {
                          open: {
                            ip: "http://192.168.2.213:5000/start",
                            jobs:  [
                              {
                                import: "Key",
                              },
                              {
                                True: [
                                  {
                                    import: "OpenAiObj",
                                  },
                                  {
                                    conversation_history: convoHistory,
                                  },
                                  {
                                    generate_image: `${prompt}`,
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        {
                          True: "end",
                        },
                      ],
                    },
                  ],
                },
              },
              {
                True: "end",
              },
            ],
          },
        ],
      })
      .then(async (res) => {
        console.log(res);
        // await listenStop();

        if (res.data.hasOwnProperty("OpenAiObj")) {
          setConversationHistory(res.data["OpenAiObj"]);
          // setMessage(
          //   res.data["OpenAiObj"][res.data["OpenAiObj"].length - 1]["response"][
          //     "content"
          //   ]
          // );
          setShowSpinner(false);
          setShowSave(true);
          const res_data = res.data["OpenAiObj"];

          setMessage(
            <>
              {res_data.map((e, i) =>
                "content" in e.response ? (
                  <div key={`divrow1-${i}`}>
                    <Row key={`row1-${i}`}>
                      <Col sm={6} key={`row1c1-${i}`}>
                        <Alert
                          key={`p-${i}`}
                          variant={"primary"}
                          style={{
                            textAlign: "left",
                            float: "left",
                          }}
                        >
                          {e.prompt}
                        </Alert><Badge bg="dark">12:00 PM</Badge>
                      </Col>
                      <Col sm={6} key={`row1c2-${i}`} style={{ textAlign: "left" }}></Col>
                    </Row>
                    <Row key={`row2-${i}`}>
                      <Col sm={6} key={`row2c1-${i}`} style={{ textAlign: "right" }}></Col>
                      <Col sm={6} key={`row2c2-${i}`}>
                      <Badge bg="dark">12:00 PM</Badge>
                        <Alert
                          key={`res-${i}`}
                          variant={"danger"}
                          style={{
                            textAlign: "right",
                            float: "right",
                          }}
                        >
                          {e.response.content}
                        </Alert>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Card key={`imgcard-${i}`} className={"mb-3"}>
                    <Image onClick={() => {
                      const uuid = uuidv4();
                      getImage(
                        res_data[res_data.length - 2]["response"]["content"],
                        uuid,
                        res_data.splice(0,res_data.length-1),
                        res_data.length - 1
                      );
                    }}  src={e.response["image"]}></Image>
                    <Card.Footer></Card.Footer>
                  </Card>
                )
              )}
            </>
          );
        }
      })
      .catch(async (res) => {
        console.log(res);
        setShowSpinner(false);
      });
  };

  const sendToApi = async (prompt, uuid) => {
    const data = props.prepData(prompt, conversationHistory);
    await axios
      // .post(`https://automate.paglipay.info/start/${appUuid}`, {
      // .post(`http://192.168.2.213:5000/start/${appUuid}`, {
      // .post(`https://paglipay-fastapi.herokuapp.com/start/${appUuid}`, {
      .post(`https://paglipay-dtree.herokuapp.com/start/${appUuid}`, data)
      .then(async (res) => {
        console.log(res);
        // await listenStop();

        setShowSpinner(false);
        if (res.data.hasOwnProperty("OpenAiObj")) {
          setConversationHistory(res.data["OpenAiObj"]);
          //   setMessage(
          //     res.data["OpenAiObj"][res.data["OpenAiObj"].length - 1]["response"][
          //       "content"
          //     ]
          //   );
          // setShowSpinner(false);

          const res_data = res.data["OpenAiObj"];

          setMessage(
            <>
              {res_data.map((e, i) =>
                "content" in e.response ? (
                  <div key={`divrow1-${i}`}>
                    <Row key={`row1-${i}`}>
                      <Col sm={6} key={`row1c1-${i}`}>
                        <Alert
                          key={`p-${i}`}
                          variant={"primary"}
                          style={{
                            textAlign: "left",
                            float: "left",
                          }}
                        >
                          {e.prompt}
                        </Alert><Badge bg="dark">12:00 PM</Badge>
                      </Col>
                      <Col sm={6} key={`row1c2-${i}`} style={{ textAlign: "left" }}></Col>
                    </Row>
                    <Row key={`row2-${i}`}>
                      <Col sm={6} key={`row2c1-${i}`} style={{ textAlign: "right" }}></Col>
                      <Col sm={6} key={`row2c2-${i}`}>
                      <Badge bg="dark">12:00 PM</Badge>
                        <Alert
                          key={`res-${i}`}
                          variant={"danger"}
                          style={{
                            textAlign: "right",
                            float: "right",
                          }}
                        >
                          {e.response.content}
                        </Alert>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Card key={`imgcard-${i}`} className={"mb-3"}>
                    <Image onClick={() => {
                      const uuid = uuidv4();
                      getImage(
                        res_data[res_data.length - 2]["response"]["content"],
                        uuid,
                        res_data.splice(0,res_data.length-1),
                        res_data.length - 1
                      );
                    }} src={e.response["image"]}></Image>
                    <Card.Footer></Card.Footer>
                  </Card>
                )
              )}
            </>
          );
          if (
            "content" in res_data[res_data.length - 1]["response"] &&
            res_data.length <= 100
          ) {
            const uuid = uuidv4();
            getImage(
              res_data[res_data.length - 1]["response"]["content"],
              uuid,
              res_data,
              res_data.length
            );
            setSpeakText({
              text: res_data[res_data.length - 1]["response"]["content"],
            });
          } else if (
            "content" in res_data[res_data.length - 1]["response"] &&
            res_data.length > 100
          ) {
            setSpeakText({
              text: "This is a long response. I will display it on the screen.",
            });
          }
        }
      })
      .catch(async (res) => {
        console.log(res);
        setShowSpinner(false);
        setSpeakText({
          text: "Sorry, there appears to be an issue connecting to the server.",
        });
      });
  };

  const sendToYoutube = async (prompt, uuid) => {
    console.log("conversationHistory: ", conversationHistory);

    // const _list = [
    //   {
    //     prompt: "write a short funny story for kids",
    //     response: {
    //       role: "assistant",
    //       content:
    //         "There once was yet another test to see if a video gets created.",
    //     },
    //   },
    // ]

    const _list = conversationHistory.filter((e) => {
      return "prompt" in e;
    });
    const image_list = _list.filter((e) => {
      return "image" in e.response;
    });
    const content_list = _list.filter((e) => {
      return "content" in e.response;
    });

    console.log("content_list: ", content_list);
    console.log("image_list: ", image_list);

    const final_list = content_list.map((obj1, i1) => {
      const obj2 = image_list.find((obj, i2) => i1 === i2);
      return {
        ...obj1,
        response: { ...obj1.response, image: obj2.response.image },
      };
    });

    console.log("final_list: ", final_list);

    const youtube_list = [{ id: `out`, title: _list[0]["prompt"] }];
    // console.log('_list:', _list)
    // console.log('youtube_list:', youtube_list)

    await axios
      // .post(`https://automate.paglipay.info/start/${appUuid}`, {
      // .post(`http://192.168.2.213:5000/start/${appUuid}`, {
      // .post(`https://paglipay-dtree.herokuapp.com/start/${appUuid}`, {
      .post(`https://paglipay-fastapi.herokuapp.com/start/${appUuid}`, {
        jobs: [
          {
            import: "Key",
          },
          {
            True: [
              {
                import: "RequestsObj",
              },
              {
                open: {
                  ip: `https://automate.paglipay.info/start`,
                  jobs: [
                    {
                      import: "Key",
                    },
                    {
                      True: [
                        {
                          import: "RequestsObj",
                        },
                        {
                          open: {
                            ip: `http://192.168.2.213:5000/start`,
                            "./my_packages/MoviePyObj/scene/_list.json":
                              final_list,
                            "./my_packages/YoutubeObj/prep/_list.json":
                              youtube_list,
                            jobs: [
                              {
                                import: "Key",
                              },
                              {
                                True: "./my_packages/MoviePyObj/scene/_create_list.json",
                              },
                              {
                                True: "./my_packages/YoutubeObj/prep/_create_list.json",
                              },
                            ],
                          },
                        },
                        {
                          True: "end",
                        },
                      ],
                    },
                  ],
                },
              },
              {
                True: "end",
              },
            ],
          },
        ],
      })
      .then(async (res) => {
        console.log(res);
        // await listenStop();
      })
      .catch(async (res) => {
        console.log(res);
        setShowSpinner(false);
        setSpeakText({
          text: "Sorry, there appears to be an issue connecting to the server.",
        });
      });
  };

  useEffect(() => {
    console.log("commands", commands);
    setConsolelog(commands.map((e) => e.command).join("\n"));
    setCommandButtons(
      commands.map((e) => (
        <>
          {" "}
          <Button onClick={e.callback}>{e.command}</Button>{" "}
        </>
      ))
    );
  }, [commands]);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (finalTranscript !== "") {
      console.log("Got final result:", finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );
  }
  const listenContinuously = async () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-GB",
    });
  };
  const listenStop = async () => {
    SpeechRecognition.stopListening();
  };

  return (
    <Row key={props.title}>
      <Col lg={12}>
        <Card style={{ height: "100%" }}>
          <Card.Header
            className="mb-3"
            as="h5"
            // onClick={() => toggleS(setSize)}
          >
            {/* <BsPersonFill size={50}/> */}
            {/* <Image src={`https://randomuser.me/api/portraits/med/men/${(() => Math.floor(Math.random() * 10))()}.jpg`} roundedCircle /> */}{" "}
            {`${props.title}`}
            <Badge variant={"badgeStatus"} style={{ float: "right" }}>
              {"badgeStatus".charAt(0).toUpperCase() + "badgeStatus".slice(1)}
            </Badge>{" "}
          </Card.Header>
          <div>
            <Row>
              <Col lg={0}>
                <div></div>
              </Col>
              <Col lg={12}>{message}</Col>
              <Col lg={0}>
                <div></div>
              </Col>
            </Row>
            <Col lg={12} style={{ display: "flex", justifyContent: "center" }}>
              <Spinner
                animation="border"
                style={{ display: showSpinner ? "block" : "none", margin: 10 }}
              />
            </Col>
            <h1>
              {" "}
              {listening ? (
                <Badge variant={"success"} style={{ float: "middle" }}>
                  {"Listening: On"}
                </Badge>
              ) : (
                <Badge variant={badgeStatus} style={{ float: "middle" }}>
                  {"Listening: Off"}
                </Badge>
              )}
            </h1>

            <div>
              {/* <Form>
                <Form.Check
                  type="checkbox"
                  id={`default-checkbox`}
                  label={`Repeat Command`}
                  onClick={() => setRepeatCommand(!repeatCommand)}
                  checked={repeatCommand}
                />
                <Form.Check
                  type="checkbox"
                  id={`default-checkbox`}
                  label={`Debug Mode`}
                  onClick={() => setDebug(!debug)}
                  checked={debug}
                />
              </Form> */}
              {/* <Button
            type="button"
            onClick={() => {
              start(["computer"]);
            }}
          >
            Start
          </Button> */}
              <Button
                type="button"
                onClick={(e) => {
                  resetTranscript(e);
                  setShowPromptBox(false);
                }}
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  listenContinuously(e);
                  setPrompt("");
                  setShowPromptBox(false);
                }}
              >
                Listen
              </Button>
              <Button type="button" onClick={SpeechRecognition.stopListening}>
                Stop
              </Button>
              {showSave && (
                <Button type="button" onClick={sendToYoutube}>
                  Save
                </Button>
              )}
            </div>
          </div>
          {debug && (
            <div>
              {/* <p>{consolelog}</p> */}
              {commandButtons}
            </div>
          )}
          <div>
            <span>{acceptedCommand}</span>
          </div>

          <div>
            <Form
              style={{ display: showPromptBox ? "none" : "block", margin: 10 }}
            >
              <Form.Group controlId="trascript">
                <h3
                  onClick={(e) => {
                    if (transcript != "") {
                      cpTranscriptToPrompt(e);
                      setShowPromptBox(true);
                    }
                  }}
                >
                  {transcript}
                </h3>
              </Form.Group>
              <Button variant="primary" type="button" onClick={sendTranscript}>
                sendTranscript
              </Button>
            </Form>
            <Form
              style={{ display: showPromptBox ? "block" : "none", margin: 10 }}
            >
              <Form.Group controlId="trascript">
                <Form.Label>Transcript</Form.Label>
                <Form.Control
                  onFocus={cpTranscriptToPrompt}
                  as="textarea"
                  rows={6}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={sendPrompt}>
                sendPrompt
              </Button>
            </Form>
          </div>
          <Card.Footer>
            <h6>UUID: {appUuid}</h6>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

export default AiChat;
