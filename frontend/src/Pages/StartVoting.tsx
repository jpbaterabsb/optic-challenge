import React from 'react';
import { useForm, Controller, ValidateResult } from 'react-hook-form';
import {
    Input,
    FormControl,
    FormLabel,
    VStack,
    FormErrorMessage,
    Box,
    Card,
} from '@chakra-ui/react';
import "react-datepicker/dist/react-datepicker.css";
import { startVoting } from '../Services/VoterService';
import { useRecoilState } from 'recoil';
import { spinnerState } from '../Atoms/spinnerState';
import { toast } from 'react-toastify';
import { Spinner } from '../Components/Spinner';
import BottomGroupButton from '../Components/BottomGroupButton';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Components/Navbar';

interface FormValues {
    startDate: Date;
    endDate: Date;
}


export const StartVoting: React.FC = () => {
    const [spinner, setSpinner] = useRecoilState(spinnerState);
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues, e: any) => {
        e.preventDefault();
        setSpinner(true);
        startVoting(data.startDate, data.endDate)
            .then(() => {
                toast(`Voter was started.`, { type: 'success' })
                resetForm();
                navigate('/voting');
            })
            .catch(e => {
                console.log(e);
                const message = e.reason ? e.reason.split(": ")[1] : e.message;
                toast(message, { type: 'error' })
            })
            .finally(() => {
                setSpinner(false);
            });

    };

    function resetForm() {
        const currentDate = new Date();
        const oneHourPlus = new Date();
        oneHourPlus.setHours(oneHourPlus.getHours() + 1);
        reset({
            startDate: currentDate,
            endDate: oneHourPlus,
        })
    }

    function isBefore(start: Date): ValidateResult {
        console.log(new Date());
        console.log(new Date(start))
        if (new Date().getTime() > new Date(start).getTime()) {
            return "date should be greater than now"
        }
        return true;
    }

    function isGreatedThanStartDate(endDate: Date): ValidateResult {
        const { startDate } = getValues();


        if (!startDate || new Date(startDate).getTime() > new Date(endDate).getTime()) {
            return "date should be greater than startDate"
        }
        return true;
    }

    if (spinner) {
        return <Spinner />
    }

    return (
        <>
            <Navbar title='Start Voting' /> 
            <Box height={'100vh'} display={'flex'} flex={1} justifyContent='center' alignItems={'center'}>

                <Card width={'40%'} height={'75%'} padding='12'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack spacing={6} align="stretch">
                            <FormControl isInvalid={!!errors.startDate}>
                                <FormLabel htmlFor="date">Start Date:</FormLabel>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{ required: 'This field is required', validate: { isBefore } }}
                                    render={({ field: { onChange, onBlur, value } }) => {
                                        return <Input
                                            placeholder="Select Date and Time"
                                            size="md"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value?.toString()}
                                            type='datetime-local'
                                        />
                                    }}
                                />
                                <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.endDate}>
                                <FormLabel htmlFor="date">End Date:</FormLabel>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    rules={{ required: 'This field is required', validate: { isGreatedThanStartDate } }}
                                    render={({ field: { onChange, onBlur, value } }) => {
                                        return <Input
                                            placeholder="Select Date and Time"
                                            size="md"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value?.toString()}
                                            type='datetime-local'
                                        />
                                    }}
                                />
                                <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
                            </FormControl>
                            <BottomGroupButton reset={() => resetForm()} />
                        </VStack>
                    </form>
                </Card>
            </Box>
        </>
    );
};
