// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVoting {
    struct VotingSession {
        string topic;
        string[] options;
        mapping(uint256 => uint256) votes; 
        mapping(address => bool) hasVoted;
        bool isActive;
    }
    
    VotingSession[] public votingSessions;
    address public owner;
    
    event SessionCreated(uint256 sessionId, string topic);
    event Voted(uint256 sessionId, uint256 optionIndex, address voter);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    // Create a new voting session
    function createVotingSession(string memory _topic, string[] memory _options) 
        public 
        onlyOwner 
    {
        require(_options.length > 0, "Must have at least one option");
        
        VotingSession storage newSession = votingSessions.push();
        newSession.topic = _topic;
        newSession.isActive = true;
        
        for(uint256 i = 0; i < _options.length; i++) {
            newSession.options.push(_options[i]);
        }
        
        emit SessionCreated(votingSessions.length - 1, _topic);
    }
    
    // Vote for an option
    function vote(uint256 _sessionId, uint256 _optionIndex) public {
        require(_sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[_sessionId];
        
        require(session.isActive, "Voting session is not active");
        require(!session.hasVoted[msg.sender], "You have already voted");
        require(_optionIndex < session.options.length, "Invalid option index");
        
        session.votes[_optionIndex]++;
        session.hasVoted[msg.sender] = true;
        
        emit Voted(_sessionId, _optionIndex, msg.sender);
    }
    
    // Get voting results
    function getResults(uint256 _sessionId) 
        public 
        view 
        returns (string memory topic, string[] memory options, uint256[] memory voteCounts) 
    {
        require(_sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[_sessionId];
        
        topic = session.topic;
        options = session.options;
        voteCounts = new uint256[](options.length);
        
        for(uint256 i = 0; i < options.length; i++) {
            voteCounts[i] = session.votes[i];
        }
    }
    
    function getSessionCount() public view returns (uint256) {
        return votingSessions.length;
    }

    function toggleSessionStatus(uint256 _sessionId) public onlyOwner {
        require(_sessionId < votingSessions.length, "Invalid session ID");
        votingSessions[_sessionId].isActive = !votingSessions[_sessionId].isActive;
    }
}