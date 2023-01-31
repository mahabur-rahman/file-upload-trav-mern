import React, { useState } from "react";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";

const Upload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose file");
  const [uploadedFile, setUploadedFile] = useState({});
  // err msg
  const [errMsg, setErrMsg] = useState("");
  // success Msg
  const [successMsg, setSuccessMsg] = useState("");
  // progress show / percent show
  const [percentage, setPercentage] = useState(0);

  // onChange input
  const onChange = (e) => {
    // console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  // submit form
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        // percentage show
        onUploadProgress: (progressEvent) => {
          setPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      // Clear percentage
      setTimeout(() => setPercentage(0), 3000);

      // console.log(res);

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setSuccessMsg("File Successfully Added ❤️");
    } catch (err) {
      console.log(err);

      setTimeout(() => setPercentage(0), 1000);

      if (err.response.status === 500) {
        setErrMsg("There was a problem with the server!");
      }

      if (err.response.status === 400) {
        setErrMsg(err.response.data.msg);
      }
    }
  };

  return (
    <>
      {/* err msg show */}
      {errMsg ? <span style={{ color: "red" }}>{errMsg}</span> : null}

      {/* alert message if file successfully uploaded */}

      {successMsg ? <Message message={successMsg} /> : null}

      {/* ----form----  */}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />

          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        {/*--------------- percentage --------------- */}
        <Progress percentage={percentage} />

        <input
          type="submit"
          value="Upload File"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      {uploadedFile ? (
        <>
          <h3 className="mt-4">{uploadedFile.fileName}</h3>
          <img
            className="mt-3"
            src={uploadedFile.filePath}
            alt=""
            width="200px"
          />
        </>
      ) : null}
    </>
  );
};

export default Upload;
