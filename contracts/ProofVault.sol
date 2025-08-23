// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ProofVault
 * @dev Soulbound Token contract for decentralized credential management
 */
contract ProofVault is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    struct Credential {
        string title;
        string issuer;
        string dateIssued;
        string ipfsHash;
        address holder;
        uint256 timestamp;
        bool isValid;
    }
    
    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public holderCredentials;
    mapping(string => bool) public usedIPFSHashes;
    
    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed holder,
        string title,
        string issuer,
        string ipfsHash
    );
    
    event CredentialRevoked(uint256 indexed tokenId);
    
    modifier validAddress(address _addr) {
        require(_addr != address(0), "ProofVault: Invalid address");
        _;
    }
    
    modifier credentialExists(uint256 tokenId) {
        require(_exists(tokenId), "ProofVault: Credential does not exist");
        _;
    }
    
    constructor() ERC721("ProofVault", "PVT") {}
    
    /**
     * @dev Mint a new credential (Soulbound Token)
     */
    function mintCredential(
        address to,
        string memory title,
        string memory issuer,
        string memory dateIssued,
        string memory ipfsHash
    ) public nonReentrant validAddress(to) returns (uint256) {
        require(bytes(title).length > 0, "ProofVault: Title cannot be empty");
        require(bytes(issuer).length > 0, "ProofVault: Issuer cannot be empty");
        require(bytes(ipfsHash).length > 0, "ProofVault: IPFS hash cannot be empty");
        require(!usedIPFSHashes[ipfsHash], "ProofVault: IPFS hash already used");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        
        credentials[newTokenId] = Credential({
            title: title,
            issuer: issuer,
            dateIssued: dateIssued,
            ipfsHash: ipfsHash,
            holder: to,
            timestamp: block.timestamp,
            isValid: true
        });
        
        holderCredentials[to].push(newTokenId);
        usedIPFSHashes[ipfsHash] = true;
        
        emit CredentialMinted(newTokenId, to, title, issuer, ipfsHash);
        
        return newTokenId;
    }
    
    /**
     * @dev Get credential details by token ID
     */
    function getCredential(uint256 tokenId) 
        public 
        view 
        credentialExists(tokenId) 
        returns (Credential memory) 
    {
        return credentials[tokenId];
    }
    
    /**
     * @dev Get all credential IDs for a holder
     */
    function getHolderCredentials(address holder) 
        public 
        view 
        validAddress(holder) 
        returns (uint256[] memory) 
    {
        return holderCredentials[holder];
    }
    
    /**
     * @dev Verify if a credential is valid
     */
    function verifyCredential(uint256 tokenId) 
        public 
        view 
        credentialExists(tokenId) 
        returns (bool) 
    {
        return credentials[tokenId].isValid && _exists(tokenId);
    }
    
    /**
     * @dev Revoke a credential (only owner)
     */
    function revokeCredential(uint256 tokenId) 
        public 
        onlyOwner 
        credentialExists(tokenId) 
    {
        credentials[tokenId].isValid = false;
        emit CredentialRevoked(tokenId);
    }
    
    /**
     * @dev Get total number of credentials minted
     */
    function totalCredentials() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Override transfer functions to make tokens soulbound
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public pure override {
        revert("ProofVault: Soulbound tokens cannot be transferred");
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public pure override {
        revert("ProofVault: Soulbound tokens cannot be transferred");
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public pure override {
        revert("ProofVault: Soulbound tokens cannot be transferred");
    }
    
    /**
     * @dev Override approve to prevent approvals
     */
    function approve(address to, uint256 tokenId) public pure override {
        revert("ProofVault: Soulbound tokens cannot be approved");
    }
    
    function setApprovalForAll(address operator, bool approved) public pure override {
        revert("ProofVault: Soulbound tokens cannot be approved");
    }
}
