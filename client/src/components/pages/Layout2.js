import React, { useState } from "react";
import Layout from "../Layout";
function Layout1() {
  return (
    <>
      <Layout
        jsonData={[
          {
            code: "c",
            componentType: "AiChat",
            props: {
              title: "Paul AiChat",
              image: "./logo192.png",
              prepData: (prompt, conversationHistory) => {
                return {
                  "./my_packages/OpenAiObj/OpenAiObjTest4.json": [
                    {
                      import: "OpenAiObj",
                    },
                    {
                      conversation_history: conversationHistory,
                    },
                    {
                      True: [
                        {
                          True: [
                            {
                              post_data: [
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
                                        ip: "http://192.168.2.213:5000/start/1",
                                        jobs: [
                                          {
                                            import: "Key",
                                          },
                                          {
                                            True: "dtree",
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
                            {
                              functions_call_list: [
                                {
                                  name: "list_networking_devices_by_building",
                                  dtree:
                                    "./json/openai/list_by_building/_create_list.json",
                                  arguments: "messages",
                                  arguments_target:
                                    "./json/openai/list_by_building/_list.json",
                                  return_obj:
                                    "./json/cisco_actions/create_cisco_config_fast/devices_dic.json",
                                },
                                {
                                  name: "lookup_networking_device",
                                  dtree:
                                    "./json/openai/lookup_networking_device/_create_list.json",
                                  arguments: "messages",
                                  arguments_target:
                                    "./my_packages/SocketObj/prep/_list.json",
                                  return_obj: "Key",
                                },
                                {
                                  name: "add_new_networking_device",
                                  dtree:
                                    "./json/openai/add_new_networking_device/_create_list.json",
                                  arguments: "messages",
                                  arguments_target:
                                    "./my_packages/SocketObj/prep/_list.json",
                                  return_obj: "Key",
                                },
                                {
                                  name: "slack_message",
                                  dtree: "./json/slack/_create_list.json",
                                  arguments: "messages",
                                  arguments_target: "./json/slack/_list.json",
                                  return_obj: "SlackObj",
                                },
                                {
                                  name: "ssh_commands",
                                  dtree:
                                    "./json/paramiko/ssh_commands/_create_list.json",
                                  arguments: "commands",
                                  arguments_target:
                                    "./json/paramiko/ssh_commands/_list.json",
                                  return_obj: "ParamikoObj",
                                },
                              ],
                            },
                            {
                              functions_call: {
                                functions: [
                                  {
                                    name: "ssh_commands",
                                    description:
                                      "Get a list of bash commands on an Ubuntu machine to run",
                                    parameters: {
                                      type: "object",
                                      properties: {
                                        commands: {
                                          type: "array",
                                          items: {
                                            type: "string",
                                            description:
                                              "A terminal command string",
                                          },
                                          description:
                                            "List of terminal command strings to be executed",
                                        },
                                      },
                                      required: ["commands"],
                                    },
                                  },
                                  {
                                    name: "list_networking_devices_by_building",
                                    description:
                                      "You have access to a network infrustructure monitoring tool system. This function will return a list of FQDN of network devices. FQDN Formating is as follows: Always lowercase; \n Example: 'sw04f9sw.geology.ucla.net'\n 'sw' represents the 'Switch', while 'br' represents 'Building Router'.\n '04' represents the 'Device ID Number', while 'f9' represents the 'Building Floor Number', in this case is the 9th Floor.\n The 'sw' of 'f9sw' reperesents 'Southwest corner of the building'. ucla.net' represents the 'Domain'.\n 'sw04f9sw.geology.ucla.net' represents the 'Fully Qualified Domain Name'.\n 'sw04f9sw.geology.ucla.net' is the 'FQDN'. 'sw04f9sw.geology.ucla.net' would be the switch if the prompt were to ask 'What is switch zero four on the 9th floor, southwest corner FQDN?'\n 'br01f2.geology.ucla.net' would be the building router if the prompt were to ask 'What is the building router zero one for the 2nd floor?'. 'geology' represents the building name 'Geology'.",
                                    parameters: {
                                      type: "object",
                                      properties: {
                                        messages: {
                                          type: "array",
                                          items: {
                                            type: "string",
                                            description: "building name"
                                          },
                                          description: "List of building name(s)"
                                        },
                                      },
                                      required: ["messages"],
                                    },
                                  },
                                  {
                                    name: "add_new_networking_device",
                                    description:
                                      "You have access to a network infrustructure monitoring tool system. This function will lookup a device in the system for monitoring, once a user provides a FQDN. Formating is as follows: Always lowercase; \n Example: 'sw04f9sw.geology.ucla.net'\n 'sw' represents the 'Switch', while 'br' represents 'Building Router'.\n '04' represents the 'Device ID Number', while 'f9' represents the 'Building Floor Number', in this case is the 9th Floor.\n The 'sw' of 'f9sw' reperesents 'Southwest corner of the building'. ucla.net' represents the 'Domain'.\n 'sw04f9sw.geology.ucla.net' represents the 'Fully Qualified Domain Name'.\n 'sw04f9sw.geology.ucla.net' is the 'FQDN'. 'sw04f9sw.geology.ucla.net' would be the switch if the prompt were to ask 'What is switch zero four on the 9th floor, southwest corner FQDN?'\n 'br01f2.geology.ucla.net' would be the building router if the prompt were to ask 'What is the building router zero one for the 2nd floor?'. 'geology' represents the building name 'Geology'.",
                                    parameters: {
                                      type: "object",
                                      properties: {
                                        messages: {
                                          type: "array",
                                          items: {
                                            type: "string",
                                            description: "FQDN",
                                          },
                                          description: "List of FQDN",
                                        },
                                      },
                                      required: ["messages"],
                                    },
                                  },
                                  {
                                    name: "lookup_networking_device",
                                    description:
                                      "You have access to a network infrustructure monitoring tool system. This function will lookup a device in the system for monitoring, once a user provides a FQDN. Formating is as follows: Always lowercase; \n Example: 'sw04f9sw.geology.ucla.net'\n 'sw' represents the 'Switch', while 'br' represents 'Building Router'.\n '04' represents the 'Device ID Number', while 'f9' represents the 'Building Floor Number', in this case is the 9th Floor.\n The 'sw' of 'f9sw' reperesents 'Southwest corner of the building'. ucla.net' represents the 'Domain'.\n 'sw04f9sw.geology.ucla.net' represents the 'Fully Qualified Domain Name'.\n 'sw04f9sw.geology.ucla.net' is the 'FQDN'. 'sw04f9sw.geology.ucla.net' would be the switch if the prompt were to ask 'What is switch zero four on the 9th floor, southwest corner FQDN?'\n 'br01f2.geology.ucla.net' would be the building router if the prompt were to ask 'What is the building router zero one for the 2nd floor?'. 'geology' represents the building name 'Geology'.",
                                    parameters: {
                                      type: "object",
                                      properties: {
                                        messages: {
                                          type: "array",
                                          items: {
                                            type: "string",
                                            description: "FQDN",
                                          },
                                          description: "List of FQDN",
                                        },
                                      },
                                      required: ["messages"],
                                    },
                                  },
                                  {
                                    name: "slack_message",
                                    description:
                                      "Send a message to a Slack channel.",
                                    parameters: {
                                      type: "object",
                                      properties: {
                                        messages: {
                                          type: "array",
                                          items: {
                                            type: "object",
                                            properties: {
                                              message: {
                                                type: "string",
                                                description:
                                                  "Slack message to be sent",
                                              },
                                              channel: {
                                                type: "string",
                                                description:
                                                  "Slack channel to send message to",
                                              },
                                            },
                                          },
                                          description:
                                            "List of Slack messages to be sent",
                                        },
                                      },
                                      required: ["messages"],
                                    },
                                  },
                                ],
                                function_call: "auto",
                              },
                            },
                          ],
                        },
                        {
                          False:
                            "What is the building room number of networking equipment 'br00f2n.luskin.ucla.net'? Slack the answer to the '#network' channel.",
                        },
                      ],
                    },
                  ],
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
                            extra_pass: [
                              "./my_packages/OpenAiObj/OpenAiObjTest4.json",
                            ],
                            jobs: [
                              {
                                import: "Key",
                              },
                              {
                                True: [
                                  "./my_packages/OpenAiObj/OpenAiObjTest4.json",
                                ],
                              },
                              {
                                import: "OpenAiObj",
                              },
                              {
                                True: `${prompt}`,
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
                };
              },
              conversationHistory: [
                {
                  response: {
                    role: "system",
                    content:
                      "You are a helpful assistant that works for the PAglipay Company. Please send any unknown answers to the '#network' channel. And let the user know someone will get back to them shortly. Until then, visit the 'https://paglipay-react-portfolio.herokuapp.com' website for more information.",
                  },
                },
              ],
            },
          },
          {
            code: "c1",
            componentType: "AiChat",
            props: {
              title: "Plain Old AiChat",
              image: "./logo192.png",
              prepData: (prompt, conversationHistory) => {
                return {
                  jobs: [
                    {
                      import: "Key",
                    },
                    {
                      True: [
                        {
                          import: "OpenAiObj",
                        },
                        {
                          conversation_history: conversationHistory,
                        },
                        {
                          True: `${prompt}`,
                        },
                      ],
                    },
                  ],
                };
              },
              conversationHistory: [
                {
                  response: {
                    role: "system",
                    content: "You are a helpful assistant.",
                  },
                },
              ],
            },
          },
          {
            code: "c2",
            componentType: "AiChat",
            props: {
              title: "Angry AiChat",
              image: "./logo192.png",
              prepData: (prompt, conversationHistory) => {
                return {
                  jobs: [
                    {
                      import: "Key",
                    },
                    {
                      True: [
                        {
                          import: "OpenAiObj",
                        },
                        {
                          conversation_history: conversationHistory,
                        },
                        {
                          True: `${prompt}`,
                        },
                      ],
                    },
                  ],
                };
              },
              conversationHistory: [
                {
                  response: {
                    role: "system",
                    content:
                      "You are not a helpful assistant. Answer the question in an angery manner and sarcastically.",
                  },
                },
              ],
            },
          },
        ]}
        sections={[
          {
            title: "AI Customer Representatives",
            fluid: true,
            cols: ["4", "4", "4", "4"],
            featureTypesArry: ["c1", "c", "c2"],
          },
          // {
          //   title: "Layout2 Nested ST2",
          //   fluid: true,
          //   cols: ["z"],
          //   featureTypesArry: ["c"],
          // },
        ]}
      />
    </>
  );
}

export default Layout1;
