import file from '../../Assets/Img/file.svg';
import React, { useContext, useEffect, useState } from "react";
import global_style from "../../Assets/CSS/global.module.css";
import global_styles from "../../Assets/CSS/global.module.css";
import local_style from "./request_card.module.css";
import { Col, Row } from "react-bootstrap";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import HTTPService from "common/services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "common/components/context/VistaarContext/FarmStackProvider";

import { Badge, Modal } from "antd";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { getUserMapId } from "common/utils/utils";
import SelectionOfColumnForConsuming from "./API's/SelectionOfColumnForConsuming";
import EmptyFile from "./TabComponents/EmptyFile";
const ConsumerApiRequestTable = (props) => {
  const { datasetid } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading } = useContext(FarmStackContext);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    props.handleClickForRequest("request");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  function copyToClipboard(text) {
    // Try to copy the text to the clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        callToast(`Text copied to clipboard: ${text}`, "info", true);
        console.log("Text copied to clipboard:", text);
      })
      .catch((error) => {
        callToast(`Text copied to clipboard: ${text}`, "info", true);
        console.error("Error copying text to clipboard:", error);
      });
  }

  const createCurl = (api) => {
    let url = UrlConstant.base_url + "microsite/datasets_file/api/?page=1";
    let curl = `curl --location '${url}' \
    --header 'api-key: ${api}'`;
    copyToClipboard(curl);
  };
  const { data, setApprovalStatus, approvalStatus, setRefetcher, refetcher } =
    props;

  const { callLoader, callToast, selectedFileDetails } =
    useContext(FarmStackContext);
  // const theme = useTheme();
  // const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const tablet = useMediaQuery(theme.breakpoints.down("md"));
  // const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  const [requestReceivedColumns, setRequestReceivedColumns] = useState([]);
  //   const [noDataRequest, setNoDataRequest] = useState(true);

  const [toDate, setToDate] = useState({});
  const [requestToShow, setRequestsToShow] = useState([]);
  //   const SubmitHandler = (condition, usagePolicyId) => {
  //     callLoader(true);
  //     let url =
  //       UrlConstant.base_url + "datahub/usage_policies/" + usagePolicyId + "/";
  //     let method = "PATCH";
  //     let payload;
  //     if (condition == "approved") {
  //       let date = toDate ? new Date(toDate) : null;
  //       if (date) {
  //         let timezoneOffset = date.getTimezoneOffset() * 60 * 1000; // convert to milliseconds
  //         date = new Date(date.getTime() - timezoneOffset); // adjust for timezone offset
  //       }
  //       payload = {
  //         approval_status: condition,
  //         accessibility_time: toDate[usagePolicyId]
  //           ? new Date(toDate[usagePolicyId]).toISOString().substring(0, 10)
  //           : null,
  //         type: "api",
  //       };
  //     } else {
  //       payload = { approval_status: condition };
  //     }
  //     HTTPService(method, url, payload, false, true, false, false)
  //       .then((response) => {
  //         callLoader(false);
  //         // setRefetcher(!refetcher);
  //         props.setRefetchAllRequest(!props.refetchAllRequest);
  //         // console.log(response);
  //         callToast(
  //           condition === "approved"
  //             ? "Request approved successfully"
  //             : "Request rejected successfully",
  //           "success",
  //           true
  //         );
  //         // setApprovalStatus(!approvalStatus);
  //         // setToDate([]);
  //       })
  //       .catch((error) => {
  //         callLoader(false);
  //         callToast("Request unsuccessfull", "error", true);
  //       });
  //   };

  const getAllDatasetFiles_context = (type) => {
    callLoader(true);
    let url = `${UrlConstant.base_url}${
      UrlConstant.datasetview
    }${datasetid}/?user_map=${getUserMapId()}${
      type === "dataset_file" ? "" : "&type=api"
    }`;
    let authToken = true;

    let method = "GET";
    HTTPService(method, url, "", false, authToken)
      .then((response) => {
        console.log(
          "🚀 ~ file: ViewDashboardAndApiRequesting.jsx:75 ~ .then ~ response:",
          response
        );
        //setting all the files for files
        let arrayForFileToHandle = [];
        for (let i = 0; i < response.data.datasets.length; i++) {
          let eachFile = response.data.datasets[i];
          if (
            eachFile?.file.endsWith("xls") ||
            eachFile?.file.endsWith("xlsx") ||
            eachFile?.file.endsWith("csv")
          ) {
            arrayForFileToHandle.push(eachFile);
          }
        }

        console.log(
          "🚀 ~ file: ConsumerApiRequestTable.jsx:118 ~ .then ~ arrayForFileToHandle:",
          arrayForFileToHandle
        );

        setRequestsToShow([...arrayForFileToHandle]);
        callLoader(false);
      })
      .catch((error) => {
        callLoader(false);
        console.log(error);
      });
  };
  useEffect(() => {
    // setRefetcher(!refetcher);
    let columnsForReceived = [
      "File details",
      "Columns details",
      "Status",
      "API details",
      "Actions",
    ];
    setRequestReceivedColumns(columnsForReceived);
  }, []);
  //   useEffect(() => {
  //     let show = true;
  //     if (filter == "all" || !filter) {
  //       let arr = [];
  //       for (let i = 0; i < data.length; i++) {
  //         // if (data[i]?.accessibility == "private") {
  //         arr = [...arr, data[i]];
  //         if (data[i]?.usage_policy?.length > 0) {
  //           show = false;
  //         }
  //         // }
  //       }
  //       // console.log(arr);
  //       setNoDataRequest(show);
  //       setRequestsToShow([...arr]);
  //       return;
  //     }
  //     let arr = [];
  //     for (let i = 0; i < data.length; i++) {
  //       if (true) {
  //         let obj = { ...data[i] };
  //         let eachArr = obj["usage_policy"].filter((eachUsagePolicy, index) => {
  //           return eachUsagePolicy.approval_status == filter;
  //         });
  //         if (eachArr?.length > 0) {
  //           show = false;
  //         }
  //         obj["usage_policy"] = [...eachArr];
  //         arr.push(obj);
  //       }
  //     }
  //     setNoDataRequest(show);
  //     setRequestsToShow([...arr]);
  //   }, [data]);
  let counter = 0;

  useEffect(() => {
    getAllDatasetFiles_context();
  }, [props.refresh]);

  let allUsagePolicy = 0;
  for (let i = 0; i < requestToShow?.length; i++) {
    console.log();
    for (let j = 0; j < requestToShow[i]?.usage_policy?.length; i++) {
      allUsagePolicy++;
    }
  }

  return (
    !isLoading && (
      <>
        <Row className="mt-20">
          <Col lg={8} md={12} sm={12}>
            <div
              className={
                global_style.bold600 +
                " " +
                global_style.size32 +
                " " +
                local_style.text_left
              }
            >
              Self requested API's
            </div>
            <Typography
              className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
            >
              {" "}
              All the API requests
            </Typography>
          </Col>
          <Col lg={4} md={12} sm={12} style={{ textAlign: "right" }}>
            <Button
              style={{ marginTop: "25px" }}
              className={local_style.request_access}
              onClick={() => showModal()}
              // onClick={() => props.handleClickForRequest("request")}
            >
              + New API Request
            </Button>
          </Col>
        </Row>
        {allUsagePolicy == 0 ? (
          <EmptyFile text={"No requests are available."} />
        ) : (
          <Box sx={{ overflow: "auto", height: "450px" }}>
            <Table
              stickyHeader
              sx={{
                "& .MuiTableCell-root": {
                  fontFamily: "Arial",
                },
              }}
            >
              <TableHead
                sx={{
                  background: "#F8F8F8 !important",
                  fontFamily: "Arial",
                }}
              >
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      fontFamily: "Arial",
                    },
                  }}
                >
                  {requestReceivedColumns.map((eachHead, index) => {
                    return (
                      <TableCell
                        sx={{
                          "& .MuiTableCell-root": {
                            fontFamily: "Arial",
                          },
                          textAlign: "left",
                          alignItems: "left",
                        }}
                        className={local_style.file_table_column}
                      >
                        {eachHead}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              {requestToShow.length > 0 && (
                <TableBody>
                  {requestToShow?.map((eachDatasetFile, index) => {
                    if (true)
                      return eachDatasetFile?.usage_policy?.length > 0
                        ? eachDatasetFile?.usage_policy.map(
                            (eachUsagePolicy, usagePolicyIndex) => {
                              counter++;
                              if (
                                eachUsagePolicy?.type == "api" &&
                                eachDatasetFile?.id == selectedFileDetails?.id
                              ) {
                                return (
                                  <TableRow>
                                    {/* <TableCell> */}
                                    <TableCell component="th" scope="row">
                                      <div
                                        style={{ display: "flex", gap: "20px" }}
                                      >
                                        <span>
                                          <div
                                            className={
                                              global_styles.bold600 +
                                              " " +
                                              global_styles.size14
                                            }
                                            style={{
                                              textOverflow: "ellipsis",
                                              display: "flex",
                                              alignItems: "center",
                                              columnGap: "10px",
                                            }}
                                          >
                                            <img  src={file} 
                                              alt=""
                                              style={{
                                                display: "inline-block",
                                              }}
                                            />
                                            <div
                                              style={{
                                                maxWidth: "150px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                textWrap: "nowrap",
                                              }}
                                              className={local_style.link_name}
                                            >
                                              {eachDatasetFile.file
                                                ?.split("/")
                                                .at(-1)}
                                            </div>
                                          </div>
                                          <div>Dataset file name</div>
                                        </span>
                                        <span></span>
                                      </div>
                                    </TableCell>

                                    {/* <TableCell>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "0.5fr 1fr",
                                      gridTemplateRows: "1fr 1fr",
                                      gridGap: "10px",
                                    }}
                                  >
                                    <div
                                      className={local_style.each_value_in_div}
                                    >
                                      <div
                                        className={
                                          global_styles.bold600 +
                                          " " +
                                          global_styles.size14 +
                                          " " +
                                          global_style.ellipses
                                        }
                                        style={{
                                          maxWidth: "200px",
                                        }}
                                      >
                                       
                                        {eachUsagePolicy.organization.name}
                                      </div>
                                      <div>Request by</div>
                                    </div>
                                    <div
                                      className={local_style.each_value_in_div}
                                    >
                                      <div
                                        className={
                                          global_styles.bold600 +
                                          " " +
                                          global_styles.size14 +
                                          " " +
                                          global_style.ellipses
                                        }
                                        style={{
                                          maxWidth: "200px",
                                        }}
                                      >
                                        {" "}
                                        {eachUsagePolicy.organization.org_email}
                                      </div>
                                      <div>Organization email</div>
                                    </div>
                                    <div
                                      className={local_style.each_value_in_div}
                                    >
                                      <div
                                        className={
                                          global_styles.bold600 +
                                          " " +
                                          global_styles.size14 +
                                          " " +
                                          global_style.ellipses
                                        }
                                        style={{
                                          maxWidth: "150px",
                                        }}
                                      >
                                        {" "}
                                        {
                                          eachUsagePolicy.organization
                                            .phone_number
                                        }
                                      </div>
                                      <div>Organization Contact no.</div>
                                    </div>
                                    
                                  </div>

                                 
                                 
                                </TableCell> */}
                                    <TableCell>
                                      <div
                                        style={{
                                          maxHeight: "150px",
                                          overflow:
                                            "hidden" /* Hide overflowing text */,
                                          overflowY: "auto",
                                          width: "150px",
                                          wordBreak: "break-all",
                                        }}
                                      >
                                        {eachUsagePolicy?.configs?.columns?.map(
                                          (eachCol, index) => {
                                            return (
                                              <div
                                                className={
                                                  local_style.eachColForConsume
                                                }
                                                style={{ margin: "10px 10px" }}
                                              >
                                                {" "}
                                                {eachCol}{" "}
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </TableCell>
                                    {/* <TableCell style={{ textAlign: "left" }}>
                                  <div
                                    className={
                                      global_style.bold600 +
                                      " " +
                                      global_style.size14 +
                                      " " +
                                      local_style.text_left
                                    }
                                  >
                                    {eachUsagePolicy.approval_status ==
                                    "approved" ? (
                                      <Badge
                                        style={{
                                          backgroundColor:
                                            eachUsagePolicy.approval_status ==
                                            "rejected"
                                              ? "#ff5630"
                                              : eachUsagePolicy.approval_status ==
                                                "approved"
                                              ? "#00A94F"
                                              : "#faad14",
                                          width: "80px",
                                        }}
                                        count={"Apporved"}
                                      ></Badge>
                                    ) : eachUsagePolicy.approval_status ==
                                      "rejected" ? (
                                      <Badge
                                        style={{
                                          backgroundColor:
                                            eachUsagePolicy.approval_status ==
                                            "rejected"
                                              ? "#ff5630"
                                              : eachUsagePolicy.approval_status ==
                                                "approved"
                                              ? "#00A94F"
                                              : "#faad14",
                                          width: "80px",
                                        }}
                                        count={"Rejected"}
                                      ></Badge>
                                    ) : (
                                      "Period"
                                    )}
                                  </div>
                                  {eachUsagePolicy.approval_status !==
                                    "approved" &&
                                  eachUsagePolicy.approval_status !==
                                    "rejected" ? (
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DatePicker
                                        disabled={
                                          eachUsagePolicy.approval_status !==
                                          "approved"
                                            ? false
                                            : true
                                        }
                                        disablePast
                                        inputFormat="dd/MM/yyyy"
                                        placeholder="Till"
                                        label="Till"
                                        value={
                                          toDate[eachUsagePolicy?.id ?? ""] ??
                                          null
                                        }
                                        onChange={(value) =>
                                          handleToDate(
                                            value,
                                            eachUsagePolicy.id
                                          )
                                        }
                                        PaperProps={{
                                          sx: {
                                            borderRadius: "16px !important",
                                            "& .MuiPickersDay-root": {
                                              "&.Mui-selected": {
                                                backgroundColor:
                                                  "#007B55 !important",
                                              },
                                            },
                                          },
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            id="filled-basic"
                                            variant="outlined"
                                            sx={{
                                              width: "200px",
                                              svg: { color: "#00A94F" },
                                              "& .MuiInputBase-input": {
                                                height: "20px",
                                              },
                                              "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                  borderColor:
                                                    "#919EAB !important",
                                                },
                                                "&:hover fieldset": {
                                                  borderColor: "#919EAB",
                                                },
                                                "&.Mui-focused fieldset": {
                                                  borderColor: "#919EAB",
                                                },
                                              },
                                            }}
                                            required={
                                              eachUsagePolicy.approval_status ==
                                              "approved"
                                                ? false
                                                : true
                                            }
                                            helperText={
                                              <Typography
                                                sx={{
                                                  fontFamily:
                                                    "Arial !important",
                                                  fontWeight: "400",
                                                  fontSize: "12px",
                                                  lineHeight: "18px",
                                                  color: "#FF0000",
                                                  textAlign: "left",
                                                }}
                                              >
                                            
                                              </Typography>
                                            }
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  ) : eachUsagePolicy.approval_status ==
                                    "approved" ? (
                                    `Till : ${
                                      eachUsagePolicy.accessibility_time ?? "NA"
                                    }`
                                  ) : (
                                    ""
                                  )}
                                </TableCell> */}

                                    <TableCell component="th" scope="row">
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "20px",
                                          justifyContent: "left",
                                        }}
                                      >
                                        <div>
                                          <div
                                            className={
                                              global_styles.bold600 +
                                              " " +
                                              global_styles.size16
                                            }
                                          >
                                            <Badge
                                              data-testid="approved_and_reject_test_id"
                                              style={{
                                                textTransform: "capitalize",
                                                backgroundColor:
                                                  eachUsagePolicy.approval_status ==
                                                  "rejected"
                                                    ? "#ff5630"
                                                    : eachUsagePolicy.approval_status ==
                                                      "approved"
                                                    ? "#00A94F"
                                                    : "#faad14",
                                                width: "80px",
                                              }}
                                              className={
                                                global_styles.bold600 +
                                                " " +
                                                global_styles.size16
                                              }
                                              count={
                                                eachUsagePolicy.approval_status
                                              }
                                            ></Badge>
                                          </div>

                                          <div style={{ display: "flex" }}>
                                            <div
                                              style={{
                                                fontStyle: "italic",
                                                width: "112px",
                                              }}
                                              className={global_styles.ellipses}
                                              data-testid="approved-badge-test"
                                            >
                                              {eachUsagePolicy?.api_key}{" "}
                                            </div>
                                            {eachUsagePolicy?.api_key && (
                                              <ContentCopyOutlinedIcon
                                                sx={{ cursor: "pointer" }}
                                                fontSize="small"
                                                onClick={() =>
                                                  copyToClipboard(
                                                    eachUsagePolicy?.api_key
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                        </div>
                                        {/* {eachUsagePolicy?.api_key && (
                                      <div>
                                        <div
                                          className={
                                            global_styles.bold600 +
                                            " " +
                                            global_styles.size16 +
                                            " " +
                                            global_styles.ellipses
                                          }
                                          style={{ maxWidth: "112px" }}
                                        >
                                          {eachUsagePolicy?.api_key}
                                        </div>
                                        API key
                                      </div>
                                    )} */}

                                        {/* <div>
                                      <div
                                        className={
                                          global_styles.bold600 +
                                          " " +
                                          global_styles.size16 +
                                          " " +
                                          global_styles.ellipses
                                        }
                                        style={{ maxWidth: "112px" }}
                                      >
                                        {eachUsagePolicy.updated_at?.substring(
                                          0,
                                          10
                                        )}
                                      </div>
                                      Last updated
                                    </div> */}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {eachUsagePolicy?.api_key && (
                                        <Button
                                          onClick={() =>
                                            createCurl(eachUsagePolicy?.api_key)
                                          }
                                          className={local_style.copy}
                                        >
                                          Copy cURL
                                        </Button>
                                      )}
                                      {/* {eachUsagePolicy?.api_key && (
                                    <div>
                                      <div
                                        className={
                                          global_styles.bold600 +
                                          " " +
                                          global_styles.size16 +
                                          " " +
                                          global_styles.ellipses
                                        }
                                        style={{ maxWidth: "112px" }}
                                      >
                                        {eachUsagePolicy?.api_key}
                                      </div>
                                      API key
                                    </div>
                                  )} */}
                                    </TableCell>
                                    <TableCell
                                      className={
                                        local_style.table_cell_for_approve_button
                                      }
                                    >
                                      {/* {eachUsagePolicy.approval_status !==
                                    "approved" &&
                                    eachUsagePolicy.approval_status !==
                                      "rejected" && (
                                      <Button
                                        style={{
                                          border: "1px solid #00A94F",
                                          color: "#00A94F",
                                          // color: "white",
                                          textTransform: "none",
                                          height: "30px",
                                          fontFamily: "Arial",
                                          width: "100px",
                                          marginRight: "10px",
                                        }}
                                        onClick={() =>
                                          SubmitHandler(
                                            "approved",
                                            eachUsagePolicy.id
                                          )
                                        }
                                      >
                                        Approve
                                      </Button>
                                    )} */}
                                      {eachUsagePolicy.approval_status !==
                                        "rejected" && (
                                        <Button
                                          style={{
                                            border: "1px solid #ff5630",
                                            color: "#ff5630",
                                            textTransform: "none",
                                            height: "30px",
                                            width: "100px",
                                            fontFamily: "Arial",
                                          }}
                                          onClick={() => {
                                            props.handleClickForRequest(
                                              "recall",
                                              eachUsagePolicy?.id
                                            );
                                          }}
                                        >
                                          Recall
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            }
                          )
                        : "";
                  })}
                </TableBody>
              )}

              {/* {counter > 0 ? (
          {console.log(counter)}
          <NoDataAvailable message={"No request available"} />
        ) : (
          ""
        )} */}
              {/* {console.log(requestToShow, "requestToShow")} */}
            </Table>
          </Box>
        )}
        <Modal
          title={
            <div style={{ fontFamily: "Arial" }}>
              Column Selection for Consumption
            </div>
          }
          okText={<div style={{ fontFamily: "Arial" }}>Make Request</div>}
          cancelText={<div style={{ fontFamily: "Arial" }}>Cancel</div>}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          bodyStyle={{ height: "350px" }}
        >
          <SelectionOfColumnForConsuming
            setColumnName={props.setColumnName}
            columnName={props.columnName}
            columns={selectedFileDetails?.content[0] ?? {}}
          />
        </Modal>
      </>
    )
  );
};

export default ConsumerApiRequestTable;
