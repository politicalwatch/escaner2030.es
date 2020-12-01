import config from '@/config';
import axios from 'axios';


export default {
  getTopics() {
    return axios.get(getEndpoint()).then(response => response.data);

    function getEndpoint() {
      return [
        config.URL,
        '/topics/'
      ].join('');
    }
  },
  getTopic(topicId) {
    return axios.get(getEndpoint(topicId)).then(response => response.data);

    function getEndpoint(topicId) {
      return [
        config.URL,
        '/topics/',
        topicId
      ].join('');
    }
  },
  getTags(topicId) {
    return axios
      .get(getEndpoint(topicId))
      .then(response => response.data.tags);

    function getEndpoint(topicId) {
      return [
        config.URL,
        '/topics/',
        topicId
      ].join('');
    }
  },
  annotate(text, file) {
    let formData = new FormData()
    formData.append('text', text)
    formData.append('file', file)

    return axios.post(
      getEndpoint(),
      formData,
    )

    function getEndpoint() {
      return [
        config.URL,
        '/tagger/'
      ].join('');
    }
  },
  getScannerResult(taskID) {
    return axios.get(
      getEndpoint(taskID)
    )

    function getEndpoint(taskID) {
      return [
        config.URL,
        '/tagger/result/',
        taskID
      ].join('');
    }
  },
  saveScanned(title, expiration, excerpt, result) {
    return axios.post(
      getEndpoint(),
      {
        title,
        expiration,
        excerpt,
        result: JSON.stringify(result),
        verified: false
      }
    )

    function getEndpoint() {
      return [
        config.URL,
        '/scanned/',
      ].join('');
    }
  },
  getScanned(scannedId) {
    return axios.get(
      getEndpoint(scannedId)
    ).then(response => response.data)
      .catch(error => {
        console.log(error.response)
      });

    function getEndpoint(scannedId) {
      return [
        config.URL,
        '/scanned/',
        scannedId
      ].join('');
    }
  },
  searchScanned(query) {
    return axios.get(
        getEndpoint(query)
      ).then(response => response.data)
      .catch(error => {
        console.log(error.response)
      });

    function getEndpoint(query) {
      return [
        config.URL,
        '/scanned/search/',
        query
      ].join('');
    }
  }
};
