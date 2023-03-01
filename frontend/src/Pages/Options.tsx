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
import { registerOption } from '../Services/VotingResultService';
import { toast } from 'react-toastify';
import BottomGroupButton from '../Components/BottomGroupButton';
import { spinnerState } from '../Atoms/spinnerState';
import { useRecoilState } from 'recoil';
import { Spinner } from '../Components/Spinner';
import { Navbar } from '../Components/Navbar';

interface FormValues {
    name: string;
    code: string;
}


export const Options: React.FC = () => {
    const [spinner, setSpinner] = useRecoilState(spinnerState);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();


    function resetForm() {
        reset({
            name: '',
            code: ''
        })
    }

    const onSubmit = async (data: FormValues) => {
        setSpinner(true);
        registerOption({
            option: data.code,
            name: data.name,
        })
            .then(() => {
                resetForm();
                toast('Options was registerd sucessfully', {
                    type: 'success'
                });
            })
            .catch(e => {
                const message = e.reason ? e.reason.split(": ")[1] : e.message;
                toast(message, { type: 'error' })
            })
            .finally(() => setSpinner(false));
    };

    if (spinner) {
        return <Spinner />
    }

    return (
        <>
            <Navbar title='Options' />
            <Box height={'100vh'} display={'flex'} flex={1} justifyContent='center' alignItems={'center'}>

                <Card width={'40%'} height={'75%'} padding='12'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack spacing={6} align="stretch">
                            <FormControl isInvalid={!!errors.code}>
                                <FormLabel htmlFor="name">Code</FormLabel>
                                <Controller
                                    name="code"
                                    defaultValue=''
                                    control={control}
                                    rules={{
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^\d{5}$/,
                                            message: 'Not a valid 5-digit number.',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder="21345" />
                                    )}
                                />
                                <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Controller
                                    name="name"
                                    defaultValue=''
                                    control={control}
                                    rules={{
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^[A-Za-z]+(?:['-][A-Za-z]+)*\s[A-Za-z]+(?:['-][A-Za-z]+)*$/,
                                            message: 'Invalid name address',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} type="text" placeholder="Joe Biden" />
                                    )}
                                />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                            </FormControl>

                            <BottomGroupButton reset={() => resetForm()} />
                        </VStack>
                    </form>
                </Card>
            </Box>
        </>
    );
};
