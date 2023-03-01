import React from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { registerVoter } from '../Services/VoterService';
import { useRecoilState } from 'recoil';
import { spinnerState } from '../Atoms/spinnerState';
import { toast } from 'react-toastify';
import { Spinner } from '../Components/Spinner';
import BottomGroupButton from '../Components/BottomGroupButton';
import { Navbar } from '../Components/Navbar';

interface FormValues {
    address: string;
    email: string;
    date: Date | null;
}


export const Voters: React.FC = () => {
    const [spinner, setSpinner] = useRecoilState(spinnerState);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        setSpinner(true);
        registerVoter({
            address: data.address,
            dateOfBirth: data.date,
            email: data.email,
        })
            .then(() => {
                toast(`Voter ${data.address} was successfull registered.`, { type: 'success' })
                resetForm();
            })
            .catch((e: any) => {
                const message = e.reason ? e.reason.split(": ")[1] : e.message;
                toast(message, { type: 'error' })
            })
            .finally(() => {
                setSpinner(false);
            });

    };

    function resetForm() {
        reset({
            address: '',
            date: new Date(),
            email: '',
        })
    }

    if (spinner) {
        return <Spinner />
    }

    return (
        <>
            <Navbar title='Voters' />
            <Box height={'100vh'} display={'flex'} flex={1} justifyContent='center' alignItems={'center'}>

                <Card width={'40%'} height={'75%'} padding='12'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack spacing={6} align="stretch">
                            <FormControl isInvalid={!!errors.address}>
                                <FormLabel htmlFor="address">Address</FormLabel>
                                <Controller
                                    name="address"
                                    defaultValue=''
                                    control={control}
                                    rules={{
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^0x[a-fA-F0-9]{40}$/,
                                            message: 'Invalid Ethereum address',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="0x0000000000000000000000000000000000000000" />
                                    )}
                                />
                                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Controller
                                    name="email"
                                    defaultValue=''
                                    control={control}
                                    rules={{
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email address',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} type="email" placeholder="example@example.com" />
                                    )}
                                />
                                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.date}>
                                <FormLabel htmlFor="date">Date</FormLabel>
                                <Controller
                                    name="date"
                                    control={control}
                                    rules={{ required: 'This field is required' }}
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
                                <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                            </FormControl>
                            <BottomGroupButton reset={() => resetForm()} />
                        </VStack>
                    </form>
                </Card>
            </Box>
        </>
    );
};
