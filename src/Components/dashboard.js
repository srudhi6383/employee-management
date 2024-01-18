import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  Box,
} from '@chakra-ui/react';
import Pagination from './pagination';

const Dashboard = ({ onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    salary: '',
  });

  useEffect(() => {
    fetch('https://mock-ap.onrender.com/employees')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data from API:', data);
        setEmployees(data);
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        setFilteredEmployees(data.slice(startIndex, endIndex));
      })
      .catch((error) => console.error('Error fetching employee data', error));
  }, [currentPage]);
  
  

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    onOpen();
  };

  const handleDelete = (employeeId) => {
    fetch(`https://mock-ap.onrender.com/employees/${employeeId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId));
        setFilteredEmployees((prevFiltered) =>
          prevFiltered.filter((emp) => emp.id !== employeeId)
        );
      })
      .catch((error) => console.error('Error deleting employee', error));
  };

  const handleSaveChanges = () => {
    fetch(`https://mock-ap.onrender.com/employees/${selectedEmployee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedEmployee),
    })
      .then(() => {
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === selectedEmployee.id ? { ...emp, ...selectedEmployee } : emp
          )
        );
        setFilteredEmployees((prevFiltered) =>
          prevFiltered.map((emp) =>
            emp.id === selectedEmployee.id ? { ...emp, ...selectedEmployee } : emp
          )
        );
        onClose();
      })
      .catch((error) => console.error('Error updating employee details', error));
  };

  const handleFilterByDepartment = (department) => {
    const lowercaseDepartment = department.toLowerCase();
  
    if (lowercaseDepartment === 'all') {
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      setFilteredEmployees(employees.slice(startIndex, endIndex));
    } else {
      const filtered = employees.filter((emp) => emp.department.toLowerCase() === lowercaseDepartment);
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      setFilteredEmployees(filtered.slice(startIndex, endIndex));
    }
  };
  

  const handleSortBySalary = () => {
    const sorted = [...filteredEmployees].sort((a, b) => a.salary - b.salary);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setFilteredEmployees(sorted.slice(startIndex, endIndex));
  };

  const handleSearch = (searchTerm) => {
    const searchResults = employees.filter((emp) =>
      emp.firstName && emp.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setFilteredEmployees(searchResults.slice(startIndex, endIndex));
  };

  const handlePageChange = (pageNumber) => {
    console.log('Page changed to:', pageNumber);
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    console.log('startIndex:', startIndex, 'endIndex:', endIndex);
    console.log('Filtered Employees:', employees.slice(startIndex, endIndex));
    setFilteredEmployees(employees.slice(startIndex, endIndex));
  };
  
  
  
  

  const handleAddEmployee = () => {
    onOpen();
    setAddEmployeeOpen(true);
  };

  const handleAddEmployeeSubmit = () => {
    const employeeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      department: formData.department,
      salary: formData.salary,
    };

    fetch('https://mock-ap.onrender.com/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    })
      .then((response) => response.json())
      .then((newEmployee) => {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
        setFilteredEmployees((prevFiltered) => [...prevFiltered, newEmployee]);
        setAddEmployeeOpen(false);
      })
      .catch((error) => console.error('Error adding employee', error));
  };

  return (
    <>
      <Box mb={4}>
        <Button colorScheme="green" onClick={handleAddEmployee}>
          Add Employee
        </Button>
        <Button colorScheme="teal" onClick={onLogout}>
          Logout
        </Button>
      </Box>

      {isAddEmployeeOpen && (
        <Modal isOpen={isAddEmployeeOpen} onClose={() => setAddEmployeeOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <Input
                placeholder="Department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
              <Input
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddEmployeeSubmit}>
                Save
              </Button>
              <Button onClick={() => setAddEmployeeOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Box mb={4}>
        <Select
          placeholder="Filter by Department"
          onChange={(e) => handleFilterByDepartment(e.target.value)}
        >
          <option value="All">All</option>
          <option value="TECH">Tech</option>
          <option value="Operations">Operations</option>
          <option value="Marketing">Marketing</option>
        </Select>

        <Button ml={4} onClick={handleSortBySalary}>
          Sort by Salary
        </Button>
      </Box>

      <Input placeholder="Search by First Name" onChange={(e) => handleSearch(e.target.value)} />

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Department</Th>
            <Th>Salary</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredEmployees.map((employee) => (
            <Tr key={employee.id}>
              <Td>{employee.id}</Td>
              <Td>{employee.firstName}</Td>
              <Td>{employee.lastName}</Td>
              <Td>{employee.email}</Td>
              <Td>{employee.department}</Td>
              <Td>{employee.salary}</Td>
              <Td>
                <Button colorScheme="blue" mr={2} onClick={() => handleEdit(employee)}>
                  Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDelete(employee.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {filteredEmployees.length > PAGE_SIZE && (
  <Pagination
    totalItems={filteredEmployees.length}
    itemsPerPage={PAGE_SIZE}
    currentPage={currentPage}
    onPageChange={handlePageChange}
  />
)}


      {selectedEmployee && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="First Name"
                value={selectedEmployee.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <Input
                placeholder="Last Name"
                value={selectedEmployee.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
              <Input
                placeholder="Email"
                value={selectedEmployee.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <Input
                placeholder="Department"
                value={selectedEmployee.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
              <Input
                placeholder="Salary"
                value={selectedEmployee.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Dashboard;
