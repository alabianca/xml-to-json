const TEST1 = `<employee id="12345" building="1" geo="US">
<name>Alex</name>
</employee>`;

const TEST2 = `<employee id="12345"><name>Alex</name></employee>
<employee id="56789"><name>Jon</name></employee>`

const TEST3 = `<employee>
    <name>Alex</name>
    <age>25</age>
</employee>`

const TEST4 = `<employee id="12345">
</employee>`

const TEST5 = `
    <employee name="Alex"></employee>
<role>Software Dev</role>
        <locality country="US" region="TX" city="Austin"></locality>
`




module.exports.MOCK_DATA = {
    TEST1: TEST1,
    TEST2: TEST2,
    TEST3: TEST3,
    TEST4: TEST4,
    TEST5: TEST5
};