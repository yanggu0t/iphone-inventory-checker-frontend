import { FormatModelStock } from "@/service/types/apple";

interface IProps {
  stock: FormatModelStock[];
}

const Result = ({ stock }: IProps) => {
  return <pre>{JSON.stringify(stock, null, 2)}</pre>;
};

export default Result;
