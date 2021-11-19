pragma solidity ^0.8.2;

contract ERC721 {
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    event Approval(address indexed _owner, address indexed _approved, uint256 tokenId); // 允许动用单个NFT
    event ApprovalForAll(address indexed _owner, address indexed _opeator, bool _approved); // 允许动用这个人下的所有NFT

    mapping(address => uint256) internal _balances; // nft 余额数量
    mapping(uint256 => address) internal _owners;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => address) private _tokenApprovals;


    
    // Returns the num of NFTs assigned to an owner
    function balanceOf(address owner) public view returns(uint256){
        require(owner != address(0), 'Address is zero');
        return _balances[owner];
    }

    // Finds the owner of an NFT
    function ownerOf(uint256 tokenId) public view returns(address){
        address owner = _owners[tokenId];
        require(owner != address(0), 'TokenID does not exist');
        return owner;
    }

    // Enable / disable an operator to manage all of msg.senders' asset
    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    // Check if an addr is an operator for an other address
    function isApprovedForAll(address owner, address operator) public view returns(bool) {
        return _operatorApprovals[owner][operator];
    }

    // Update an approved address for an NFT 允许这个人搞这个nft 只允许一个人
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender), 'Msg.sender is not the owner or the approved operator.');
        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    // Get the approved address for the single NFT.
    function getApproved(uint256 tokenId) public view returns(address) {
        require(_owners[tokenId] != address(0), 'TokenID not exist');
        return _tokenApprovals[tokenId];
    }

    // Transfer ownership of an NFT  需要 owner 或者授权代理人操作
    function transferFrom(address from, address to, uint tokenId) public {
        address owner = ownerOf(tokenId);
        require(
            msg.sender == owner ||
            getApproved(tokenId) == msg.sender ||
            isApprovedForAll(owner, msg.sender),
            'Msg.sender is not the owner or approved for the transfer'
        );

        require(owner == from, 'From address is not the owner');
        require(to != address(0), 'Address is zero');
        require(_owners[tokenId] != address(0), 'TokenID does not exist');
        approve(address(0), tokenId);
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    // Standard transferFrom
    // Check if onERC721Received is implemented WHEN sending to smart contracts
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        transferFrom(from, to, tokenId);
        require(_checkOnERC721Received(), 'Receiver not implemented');
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    // Oversimplified
    function _checkOnERC721Received() private pure returns(bool) {
        return true;
    }

    // EIP165: Query if the contract implements another interface 确定另一个contract有一个implement.
    function supportsInterface(bytes4 interfaceId) public pure virtual returns(bool) {
        return interfaceId == 0x80ac58cd;
    }
    
    
}