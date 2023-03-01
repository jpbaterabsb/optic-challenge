import { Card, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { spinnerState } from '../Atoms/spinnerState';
import { DefaultTable } from '../Components/DefaultTable';
import { Navbar } from '../Components/Navbar';
import { Spinner } from '../Components/Spinner';
import { listVoters } from '../Services/VoterService';
import { listVotingResults } from '../Services/VotingResultService';

export const VotingResults: React.FC = () => {
    const [voters, setVoters] = useState([]);
    const [votingResults, setVotingResults] = useState([]);
    const [spinner, setSpinner] = useRecoilState(spinnerState);

    useEffect(() => {
        setSpinner(true);
        async function onInit() {
            const response = await listVoters();
            setVoters(response.data);
        }
        onInit()
            .catch((e) => toast(e.message, { type: 'error' }))
            .finally(() => setSpinner(false))
    }, [setSpinner]);

    useEffect(() => {
        setSpinner(true);
        async function onInit() {
            const listVoting = await listVotingResults();
            setVotingResults(listVoting.data);
        }
        onInit()
            .catch((e) => toast(e.message, { type: 'error' }))
            .finally(() => setSpinner(false))
    }, [setSpinner]);


    if (spinner) {
        return <Spinner />
    }

    return <Flex height={'100vh'} flexDirection={'column'}>
        <Navbar title='Voting Results' />
        <Flex height={'70%'}>
            {/* left */}
            <Flex width={'50%'} height={'100%'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
                <Text fontSize={'3xl'} marginBottom={12}>Voters</Text>
                <Card>
                    <DefaultTable headers={{
                        address: 'Address',
                        email: 'E-mail',
                        votedOption: 'Vote'
                    }} defaultValue={{
                        votedOption: 'N/A'
                    }} values={voters} fieldKey="txHash" />
                </Card>
            </Flex>
            {/* right */}
            <Flex width={'50%'} height={'100%'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
                <Text fontSize={'3xl'} marginBottom={12}>Options</Text>
                <Card>
                    <DefaultTable headers={{
                        option: 'Option',
                        name: 'Name',
                        votes: 'Votes'
                    }} defaultValue={{
                        votes: '0'
                    }} values={votingResults} fieldKey="option" />
                </Card>
            </Flex>
        </Flex>
    </Flex>;
}