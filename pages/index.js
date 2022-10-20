import React, { useState, useEffect } from 'react';
import { Button, Modal, SearchBar, ProposalCard, Loader } from '../components';
import { ethers } from 'ethers';
import DAOAddress from './contractsData/dao-address.json';
import DAOAbi from './contractsData/dao.json';
import Web3Modal from 'web3modal';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  const [proposalModal, setProposalModal] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [numProposals, setNumProposals] = useState("0");


  const getNumProposalsInDAO = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const daoContract = new ethers.Contract(
        DAOAddress.address,
        DAOAbi.abi,
        signer
      );
      
      const daoNumProposals = await daoContract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch (error) {
      console.log(error);
    }
  }


  const fetchProposalById = async (id) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const daoContract = new ethers.Contract(
        DAOAddress.address,
        DAOAbi.abi,
        signer
      );

      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        title: proposal.title.toString(),
        description: proposal.description.toString(),
        amount: proposal.amount.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yesVotes: proposal.yesVotes.toString(),
        noVotes: proposal.noVotes.toString(),
        addressTo: proposal.addressTo.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.log(error);
    }
  }


  const fetchProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals.sort((a, b) => b.proposalId - a.proposalId));
      return proposals;
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const sortedProposals = [...proposals];

    switch (activeSelect) {
      case 'Votes For':
        setProposals(sortedProposals.sort((a, b) => b.votesYes - a.votesYes));
        break;
      case 'Votes Against':
        setProposals(sortedProposals.sort((a, b) => b.votesNo - a.votesNo));
        break;
      case 'Recently Added':
        setProposals(sortedProposals.sort((a, b) => b.proposalId - a.proposalId));
        break;
      default:
        setProposals(proposals);
        break;
    }
  }, [activeSelect]);


  const onHandleSearch = (value) => {
    const filteredProposals = proposals.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()));

    if (filteredProposals.length === 0) {
      setProposals(proposals);
    } else {
      setProposals(filteredProposals);
    }
  };

  const onClearSearch = () => {
    if (proposals.length && proposals.length) {
      setProposals(proposals);
    }
  };
  

  useEffect(() => {
      setIsLoading(true);
      getNumProposalsInDAO()
      fetchProposals();
      setIsLoading(false);
    })

  if (isLoading) return (
    <div className='text-center'>
        <main style={{ padding: "1rem 0" }}>
            <h2><Loader /></h2>
        </main>
    </div>
)

  return (
    <div className='flex w-full'>
      <div className="flex flex-col w-full justify-center items-center">

      <div className="flex flex-col w-full items-center p-5 mx-3 py-10">
        <Button 
          btnName="Create A Proposal"
          btnType="primary"
          classStyles="rounded-xl text-xl px-20"
          handleClick={() => setProposalModal(true)}
        />
        <div className="flex w-2/3 sm:w-full flex flex-row sm:flex-col py-10">
          <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} clearSearch={onClearSearch} />
        </div>

      <div>
      {proposalModal && (
        <Modal
          header="Create A Proposal"
          handleClose={() => setProposalModal(false)}
        />
      )}
      </div>

        {proposals.length > 0 ? (
          <div className='flex flex-col w-full justify-center items-center'>
            {proposals.map((proposal, index) => 
              <div key={index} className='flex flex-wrap w-2/3 sm:w-full px-2'>
                <ProposalCard proposal={proposal} />
              </div>
              )}
          </div>
        ) : (
          <div className='flex flex-col w-full items-center font-semibold text-2xl py-20'>
            <Loader />
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
