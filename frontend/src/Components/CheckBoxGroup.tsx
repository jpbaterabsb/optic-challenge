import { Checkbox, List, ListItem, ScaleFade, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Option } from "../Models/VotingResult";

interface CheckboxGroupProps {
  options: Option[];
  setOption: (option: string) => void
}

export const CheckBoxGroup: React.FC<CheckboxGroupProps> = ({ options, setOption }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHover] = useState<string>('');

  function toggle(option: string) {
    setHover(option);
  }

  const handleCheckboxChange = (option: Option) => {
    setSelected(option.option)
    setOption(option.option);
  };

  return (
    <List spacing={3}>
      {options.map((option) => (
        <ScaleFade key={option.option} initialScale={0.9} in={true} >
          <ListItem 
            alignItems={'center'}
            padding={option.option === hovered ? 5: 4}
            transitionDuration={'0.1s'}
            marginX={4}
            borderRadius={'md'}
            borderWidth={'1px'}
            cursor={'pointer'}
            onMouseOver={() => toggle(option.option)}
            onMouseOut={() => toggle('')}
            bgColor={option.option === hovered || selected === option.option ? "blue.50" : undefined}
            borderColor={option.option === hovered || selected === option.option ? "blue.400" : undefined}
            onClick={() => handleCheckboxChange(option)}
          >
            <Checkbox
              isChecked={selected === option.option}
              colorScheme={selected === option.option ? "blue" : undefined}
              borderColor={selected === option.option ? "blue.600" : undefined}
            >
              <Text fontWeight="medium">{option.name}</Text>
            </Checkbox>
          </ListItem>
        </ScaleFade>
      ))
      }
    </List >
  );
};
