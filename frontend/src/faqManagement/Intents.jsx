import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TablePaginationActions from "../components/TablePaginationActions";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SearchIcon from "@material-ui/icons/Search";
import Grow from "@material-ui/core/Grow";
import Fade from "@material-ui/core/Fade";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";

import paraparse from "papaparse";

const useStyles = makeStyles((theme) => ({
  topBarPaper: {
    marginBottom: theme.spacing(2),
    height: "5em",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  searchBaritems: {
    margin: theme.spacing(2),
  },
  editBar: {
    marginBottom: theme.spacing(2),
    height: "4em",
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  searchBarPaper: {
    marginBottom: theme.spacing(2),
    display: "flex",
    height: "4em",
    alignItems: "center",
  },
  tableContainer: {
    width: "100%",
  },
  tableRow: {
    display: "flex",
  },
  tableCellCheckbox: {
    padding: theme.spacing(1),
  },
  tableCellText: {
    padding: theme.spacing(1),
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
  },
}));

export default function Questions(props) {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchData, setSearchData] = React.useState(null);
  const [checkedBoxes, setCheckedBoxes] = React.useState([]);
  const [showEditBar, setShowEditBar] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [deleteAllDialog, setDeleteAllDialog] = React.useState(false);
  const menuAnchorRef = React.useRef(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // get data for current topic
  React.useEffect(() => {
    if (props.currentTopic !== "") {
      props.getAllIntents(props.currentTopic).then((data) => {
        setData(data);
      });
    }
    // eslint-disable-next-line
  }, [props.currentTopic]);

  // for edit bar to show up
  React.useEffect(() => {
    if (checkedBoxes.length === 0) setShowEditBar(false);
    else setShowEditBar(true);
  }, [checkedBoxes]);

  // reset checkboxes when data changes
  React.useEffect(() => {
    setCheckedBoxes([]);
  }, [data]);

  // search handling
  React.useEffect(() => {
    if (searchValue === "") {
      setSearchData(null);
    } else {
      let temp = [];
      data.forEach((val) => {
        let q = val.question.toLowerCase();
        if (q.search(searchValue) !== -1) {
          temp.push(val);
        }
      });
      setSearchData(temp);
    }
  }, [searchValue, data]);

  const handleDeleteButton = () => {
    checkedBoxes.forEach((val) => {
      props.deleteIntent(val);
    });
    setData(data.filter((val) => !checkedBoxes.includes(val._id)));
    setCheckedBoxes([]);
  };

  const handleFile = (e) => {
    var file = e.target.files[0];
    console.log(file);

    paraparse.parse(file, {
      complete: function (results) {
        // assume csv is only 2 columns, [question, answer]
        const fileData = results.data;
        if (fileData[0].length !== 2) {
          // inform user that file contents are wrong
        }
        var promises = fileData.map((val) => {
          return new Promise((resolve, reject) => {
            if (!val[0] || !val[1]) {
              resolve()
            }
            else {
              const payload = {
                question: val[0],
                answer: val[1],
                similarQuestions: [],
              };
              props.createIntent(payload).then(() => {
                resolve();
              });
            }
          });
        });
        Promise.all(promises).then(() => {
          props.getAllIntents(props.currentTopic).then(val => {
            setData(val)
          })
        })
      },
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <Paper className={classes.topBarPaper}>
        <Typography variant="h5" className={classes.searchBaritems}>
          Questions
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.setAddNewIntent(true);
            }}
          >
            Add Question
          </Button>

          <IconButton
            className={classes.searchBaritems}
            ref={menuAnchorRef}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <MoreHorizIcon />
          </IconButton>

          {/* More options menu */}
          <Popper open={isMenuOpen} anchorEl={menuAnchorRef.current} transition>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener
                    onClickAway={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    <MenuList autoFocusItem={isMenuOpen}>
                      <MenuItem button component="label">
                        Upload Questions
                        <input
                          accept=".csv"
                          type="file"
                          name="file"
                          style={{ display: "none" }}
                          onChange={handleFile}
                        />
                      </MenuItem>
                      <MenuItem
                        button
                        onClick={() => {
                          setDeleteAllDialog(true);
                        }}
                      >
                        Delete All
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Paper>

      {!showEditBar ? (
        <Fade in={!showEditBar}>
          <Paper className={classes.searchBarPaper}>
            <SearchIcon className={classes.searchBaritems} />
            <InputBase
              placeholder="Search questions"
              onChange={(e) => {
                setSearchValue(e.target.value.toLowerCase());
              }}
              value={searchValue}
            />
          </Paper>
        </Fade>
      ) : (
        <Fade in={showEditBar}>
          <div className={classes.editBar}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleDeleteButton}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => setCheckedBoxes([])}
            >
              Cancel
            </Button>
          </div>
        </Fade>
      )}

      {/* Table for data */}
      <Paper variant="outlined" className={classes.tableContainer}>
        <Table aria-label="simple table">
          <TableBody>
            {(rowsPerPage > 0
              ? searchData
                ? searchData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : data.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
              : searchData
              ? searchData
              : data
            ).map((row, idx) => (
              <TableRow
                key={page * rowsPerPage + idx}
                className={classes.tableRow}
              >
                <TableCell className={classes.tableCellCheckbox}>
                  <Checkbox
                    checked={checkedBoxes.includes(row._id)}
                    onChange={(e) => {
                      setCheckedBoxes([...checkedBoxes, row._id]);
                    }}
                  />
                </TableCell>
                <TableCell
                  className={classes.tableCellText}
                  component="th"
                  scope="row"
                >
                  <ButtonBase
                    disableTouchRipple
                    disableRipple
                    onClick={() => {
                      props.setSelectedId(row._id);
                    }}
                  >
                    <Typography align="left">{row.question}</Typography>
                  </ButtonBase>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
                colSpan={2}
                count={searchData ? searchData.length : data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>

      {/* Dialogbox for deleting all */}
      <Dialog
        open={deleteAllDialog}
        onClose={() => {
          setDeleteAllDialog(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete all questions and answers?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once deleted, questions and answers cannot be retrieved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => {
              props.deleteAllIntents(props.currentTopic).then(() => {
                props.getAllIntents(props.currentTopic).then((data) => {
                  setData(data);
                  setDeleteAllDialog(false);
                });
              });
            }}
          >
            Delete All
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => {
              setDeleteAllDialog(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
