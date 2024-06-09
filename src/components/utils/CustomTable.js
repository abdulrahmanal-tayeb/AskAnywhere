
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


export default function CustomTable({headRow, width, maxWidth, data, minWidth, align="left", lastRowColor, lastRowBgColor})  {
    return (
      <TableContainer>
        <Table sx={{ minWidth, maxWidth, width }}>
          <TableHead>
            <TableRow sx={{textAlign: "left"}}>
                {headRow.map(column => <TableCell align={align}>{column}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: lastRowBgColor, color: lastRowColor } }}
              >
                {/* {console.log("YABROOO ROOW: ", row)} */}
                {row.map((column, index) => (
                    <TableCell key={index} align={align}>{column}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }