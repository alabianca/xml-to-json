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
`;

const TEST6 = `
<employee id="12345">
    <name type="first">Alex</name>
    <name type="last">La Bianca</name>
</employee>
<employee id="98765">
    <name type="first">Ash</name>
    <name type="last">Thrasher</name>
</employee>
<employee id="12332">
    <name type="first">Jon</name>
    <name type="last">Andrews</name>
</employee>
`;

const TEST7 = `
<xml>
    <employee id="123" name="alex"></employee>
    <employee id="456" name="jon"></employee>
    <employee id="789" name="ashley"></employee>
</xml>
`
const TEST8 =  `
<xml>
    <employee><name>Alex</name></employee>
    <location>US</location>
    <employee><name>Troy</name></employee>
</xml>
`

const TEST9 = `<employee id="98765">Alex</employee>`

//Invalid XML
const TEST10 = `<employee id="98765">Alex</employee`
const TEST11 = `<employee id="98765">Alex<employee>`
const TEST12 = `<employee id="98765"><employee id="12345">Jon<employee></employee>`

//nested repetition
const TEST13 = `<employee id="98765" name="alex"><employee id="123" name="jon"></employee></employee>`;
const TEST14 = `<employee id="98765" name="alex"><employee>Alex</employee></employee>`

const TEST15 = `<aaa>
<bbb>
    <bbb1>ccc</bbb1>
    <yyy>yyy</yyy>
</bbb>
<bbb>
    <ddd>ddd</ddd>
    <yyy>yyy</yyy>
</bbb>
</aaa>`;

const TEST16 = `<aaa>
<bbb>
    <ccc>ccc</ccc>
    <bbb1>bbb1</bbb1>
</bbb>
<bbb>
    <ddd>ddd</ddd>
    <bbb2>bbb2</bbb2>
</bbb>
</aaa>`

const TEST17 = `<aaa>
<bbb locale="Austin">
    <ccc>ccc</ccc>
    <bbb1 locale="Berlin">bbb1</bbb1>
</bbb>
<bbb locale="San Francisco">
    <ddd>ddd</ddd>
    <bbb2 locale="London">bbb2</bbb2>
</bbb>
</aaa>`


module.exports.MOCK_DATA = {
    TEST1: TEST1,
    TEST2: TEST2,
    TEST3: TEST3,
    TEST4: TEST4,
    TEST5: TEST5,
    TEST6: TEST6,
    TEST7: TEST7,
    TEST8: TEST8,
    TEST9: TEST9,
    I_TEST10: TEST10,
    I_TEST11: TEST11,
    I_TEST12: TEST12,
    TEST13: TEST13,
    TEST14: TEST14,
    TEST15: TEST15,
    TEST16: TEST16,
    TEST17: TEST17
};