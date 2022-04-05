import React, { useRef, useState } from "react";
import { Container, Box, Heading, VStack, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { ClaimsContext } from "../App";

const UploadFile = () => {
  const { setClaims } = React.useContext(ClaimsContext);

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
    console.log(event.target.files[0]);
  };

  const handleSubmission = () => {
    let formData = new FormData();
    formData.append("maxdiff", selectedFile);
    // show spinning mouse cursor
    document.body.style.cursor = "progress";
    let status = 0;
    fetch("/api/request_load_pickle_sim", { method: "POST", body: formData })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setClaims(data);
        // sets list of claims to the claims from the uploaded Excel file
      })
      .finally(() => {
        // give regular mouse cursor back
        document.body.style.cursor = "default";
      });
  };

  return (
    <Box
      boxShadow={"dark-lg"}
      borderRadius={"lg"}
      bg={"whiteAlpha.200"}
      h={"50vh"}
      w={"25%"}
      display={"flex"}
      position={"static"}
      justifyContent={"center"}
      alignContent={"center"}
      margin={"auto"}
      padding={20}
    >
      <VStack spacing={12} justifyContent={"center"}>
        <Heading>File Upload</Heading>

        <Box>
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            size={"6x"}
            onClick={() => fileInputRef.current.click()}
            cursor={"pointer"}
          />
        </Box>

        <VStack spacing={4}>
          <Button
            size={"lg"}
            padding={6}
            onClick={() => fileInputRef.current.click()}
          >
            Select .xlsx File
          </Button>

          <input
            name="file"
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            onChange={handleChange}
            hidden
            required
          />

          {isSelected ? (
            <div>
              <p>Filename: {selectedFile.name}</p>
              <p>Filetype: {selectedFile.type}</p>
              <p>Size in bytes: {selectedFile.size}</p>
            </div>
          ) : (
            <p>Select a file to show details</p>
          )}
          <Button
            size={"lg"}
            padding={6}
            type={"submit"}
            value={"Submit"}
            onClick={handleSubmission}
          >
            Submit
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default UploadFile;
