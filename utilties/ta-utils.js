module.exports.checkIfDoubtIdExistsInDoubtsArr = (doubtsAccepted, doubtId) => {
  return doubtsAccepted.some((element) => {
    return element.doubt == doubtId;
  });
};
