import React, { useState } from "react";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";
import "./Dictionary.css";

export default function Dictionary(props) {
  let [keyword, setKeyword] = useState(props.defaultKeyword);
  let [results, setResults] = useState(null);
  let [loaded, setLoaded] = useState(false);
  let [photos, setPhotos] = useState(null);

  function handleDictionResponse(response) {
   setResults(response.data[0]);
 }
 function handlePexelsResponse(response) {
  setPhotos(response.data.photos);
}

function search(word = keyword) {
  let apiKey = "95302ab7f46ea49b23t9315bo4bc8de7";
  let apiUrl = `https://api.shecodes.io/dictionary/v1/define?word=${word}&key=${apiKey}`;

  axios.get(apiUrl)
    .then(handleDictionResponse)
    .catch(error => {
      console.error('Error fetching dictionary data:', error);
    })
    .then(() => {
      let pexelsApiKey = "qisjqKrG9zgRcM7qJNdLIN4W7H3DWOI3iWB1dpYBH1rPWKbKJYWntYB2";
      let pexelsApiUrl = `https://api.pexels.com/v1/search?query=${word}&per_page=9`;
      let headers = { Authorization: `Bearer ${pexelsApiKey}` }; 
      
      axios.get(pexelsApiUrl, { headers: headers })
        .then(handlePexelsResponse)
        .catch(error => {
          console.error('Error fetching photos data:', error);
        });
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  function load() {
    setLoaded(true);
    search();
  }

  if (loaded) {
    return (
      <div className="Dictionary">
        <section>
          <h1>Dictionary</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="search"
              onChange={handleKeywordChange}
              defaultValue={props.defaultKeyword}
            />
          </form>
        </section>
        <Results results={results} />
        <Photos photos={photos} />
      </div>
    );
  } else {
    load();
    return "Loading";
  }
}