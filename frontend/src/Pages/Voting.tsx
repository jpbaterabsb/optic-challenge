import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { accountState } from '../Atoms/providerState';
import { spinnerState } from '../Atoms/spinnerState';
import { votingPeriodState } from '../Atoms/votingPeriodState';
import { CheckBoxGroup } from '../Components/CheckBoxGroup';
import { Navbar } from '../Components/Navbar';
import { castVote } from '../Services/VoterService';
import { getVoteData, listVotingResults } from '../Services/VotingResultService';


export const Voting: React.FC = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<string>('');
    const [voteState, setVote] = useState<any>({ hasVoted: false, votedOption: '' });
    const [options, setOptions] = useState<[]>([]);
    const [votingPeriod] = useRecoilState(votingPeriodState);
    const [account] = useRecoilState(accountState);
    const [spinner, setSpinner] = useRecoilState(spinnerState);
    const [time, setTime] = useState('');


  useEffect(() => {
    let intervalId: any;
    if(votingPeriod.endTimestamp) {
      intervalId = setInterval(() => {
        if(votingPeriod.endTimestamp) {
        const periodInSeconds = Math.floor((votingPeriod.endTimestamp.getTime() - new Date().getTime()) / 1000);
        const hours = Math.floor(periodInSeconds / 3600);
        const minutes = Math.floor((periodInSeconds - hours * 3600) / 60);
        const seconds = periodInSeconds - hours * 3600 - minutes * 60;
          setTime(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [votingPeriod, setTime]);

    useEffect(() => {
        async function getVote() {
            const vote = await getVoteData(account);

            if (vote.hasVoted) {
                setVote(vote);
            }
        }

        getVote();
    }, [account, setVote]);

    useEffect(() => {
        if (!votingPeriod.startTimestamp || votingPeriod.startTimestamp > new Date()) {
            navigate('/');
            return () => { };
        }

        if (votingPeriod.endTimestamp && votingPeriod.endTimestamp < new Date()) {
            navigate('/voting-results');
            return () => { };
        }
        setSpinner(true);
        async function getOptions() {
            const list = await listVotingResults();
            setOptions(list.data);
        }

        getOptions()
            .catch((e) => {
                const message = e.reason ? e.reason.split(": ")[1] : e.message;
                toast(message, { type: 'error' })
            })
            .finally(() => setSpinner(false));
    }, [navigate, votingPeriod.endTimestamp, votingPeriod.startTimestamp, setSpinner, account]);

    function handleClick() {
        setSpinner(true);
        castVote(selected)
            .then(() => {
                toast('Your vote has been registered successfully.', { type: 'success' })
                setVote({
                    hasVoted: true,
                    votedOption: selected
                });
            })
            .catch((e) => {
                const message = e.reason ? e.reason.split(": ")[1] : e.message;
                toast(message, { type: 'error' })
            })
            .finally(() => setSpinner(false));
    }

    if (spinner) {
        return <Spinner />
    }
    
    return <>
    <Navbar title='Voting' />
    {time && <Text textAlign={'end'} marginRight={8} marginTop={8} fontWeight={'bold'} fontSize={'md'}>{`Time left: ${time}`}</Text>}
    <Flex height={'80vh'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
        {voteState.hasVoted ?
            (<Text fontSize={'6xl'}>{`You voted for ${voteState.votedOption}, please wait until the end of the voting`}</Text>)
            : (
                <>
                    <Text fontSize='6xl' marginBottom={8}>Elections</Text>
                    <Box width={{ md: '60vw', lg: '50vw', sm: '80vw' }} >
                        <CheckBoxGroup setOption={setSelected} options={options} />
                    </Box>
                    <Button onClick={handleClick} isDisabled={!selected} size={'lg'} alignSelf={'center'} marginTop={16} width='28' colorScheme="blue">
                        Confirm
                    </Button>
                </>
            )}
    </Flex>
    </>
}

