import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Variable {
  id: number;
  name: string;
  value: string;
}

export function VariableList({ variables }: { variables: Variable[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variables.map((variable) => (
          <TableRow key={variable.id}>
            <TableCell>{variable.name}</TableCell>
            <TableCell>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {variable.value.replace(/./g, "•")}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
