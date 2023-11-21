var AudioVideoConferenceState = {
  onGoingAudioCall: false,
  onGoingVideoCall: false
};

exports.setAudioConferenceState = function(onGoingAudioCall) {
  AudioVideoConferenceState.onGoingAudioCall = onGoingAudioCall;
};

exports.setVideoConferenceState = function(onGoingVideoCall) {
  AudioVideoConferenceState.onGoingVideoCall = onGoingVideoCall;
};

exports.getAudioVideoConferenceState = function() {
  return AudioVideoConferenceState;
};
