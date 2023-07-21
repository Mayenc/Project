
//JavaScript


var nodes = [
    { id: 1, name: "Jack Hill", role: "CEO", img: "https://cdn.balkan.app/shared/a/2.jpg" },
    { id: 100, pid: 1, name: "Dean Hunter", role: "Assistant", tags: ['assistant'], img: "https://cdn.balkan.app/shared/a/19.jpg" },
    { id: 2, pid: 1, name: "Tommy Hines", department: 'Sales', role: "Sales Manager", img: "https://cdn.balkan.app/shared/a/3.jpg" },
    { id: 3, pid: 2, name: "Eloise Dittman", role: "Junior Sales", img: "https://cdn.balkan.app/shared/a/4.jpg" },
    { id: 4, pid: 2, name: "Kevin Chandler", role: "Sales", img: "https://cdn.balkan.app/shared/a/5.jpg" },
    { id: 5, pid: 2, name: "Alex Lane", role: "Senior Sales", img: "https://cdn.balkan.app/shared/a/6.jpg" },
    { id: 6, pid: 1, name: "Rufus Marrow", department: 'Technology', role: "QA Manager", img: "https://cdn.balkan.app/shared/a/7.jpg" },
    { id: 7, pid: 6, name: "Joanna Quinn", role: "QA", img: "https://cdn.balkan.app/shared/a/8.jpg" },
    { id: 8, pid: 6, name: "Wendy Harvey", role: "QA", img: "https://cdn.balkan.app/shared/a/9.jpg" },
    { id: 9, pid: 6, name: "Mallory Castillo", role: "Automation QA", img: "https://cdn.balkan.app/shared/a/10.jpg" },
    { id: 10, pid: 1, name: "Drake Stephens", department: 'Technology', role: "Dev Manager", img: "https://cdn.balkan.app/shared/a/11.jpg" },
    { id: 11, pid: 10, name: "Maggie Duncan", role: "Developer", img: "https://cdn.balkan.app/shared/a/12.jpg" },
    { id: 12, pid: 10, name: "Ursula Conner", role: "Senior Developer", img: "https://cdn.balkan.app/shared/a/13.jpg" },
    { id: 13, pid: 10, name: "Rowena Maxwell", role: "Developer", img: "https://cdn.balkan.app/shared/a/14.jpg" },
    { id: 14, pid: 1, name: "Jerome Silva", department: 'Marketing', role: "Marketing Manager", img: "https://cdn.balkan.app/shared/a/15.jpg" },
    { id: 15, pid: 14, name: "Tad Swanson", role: "Marketing", img: "https://cdn.balkan.app/shared/a/16.jpg" },
    { id: 16, pid: 14, name: "Oswald Jackson", role: "Junior Marketing", img: "https://cdn.balkan.app/shared/a/17.jpg" },
    { id: 17, pid: 14, name: "Zea West", role: "Marketing", img: "https://cdn.balkan.app/shared/a/18.jpg" }
];

OrgChart.templates.ula.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect><line x1="2.5" y1="1" x2="247.5" y2="1" stroke-width="2" stroke="none"></line>';
OrgChart.templates.ula.img_0 = '<clipPath id="{randId}"><rect x="10" y="35" width="50" height="50" rx="5" ry="5"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="35" width="50" height="50" ></image>';
OrgChart.templates.ula.field_0 = '<text data-width="230" style="font-size: 18px;" fill="#2A292E" x="10" y="25">{val}</text>';
OrgChart.templates.ula.field_1 = '<text data-width="190" style="font-size: 16px;" fill="#2A292E" x="70" y="65">{val}</text>';

var chart = new OrgChart(document.getElementById("tree"), {
    template: 'ula',    
    editForm: {
        readOnly: true
    },
    scaleInitial: OrgChart.match.boundary,
    mouseScrool: OrgChart.action.ctrlZoom,
    layout: OrgChart.layout.mixed,
    mixedHierarchyNodesSeparation: 0,
    nodeBinding: {
        field_0: "role",
        field_1: "name",
        img_0: "img"
    }
});

chart.on('nodes-initialized', function (sender, args) {
  var departmentNodes = [];
    for (var id in args.nodes) {
        var node = args.nodes[id];
        var data = sender.get(id);

        if (data && data.department && node.parent) {
            var pdata = sender.get(node.pid);
            if (!pdata.department) {
                var departmentNode = args.nodes[data.department];
                if (!departmentNode) {
                    OrgChart.templates[data.department] = Object.assign({}, OrgChart.templates.ana);

                    departmentNode = new OrgChart.node(data.department, '', ['department', data.department.toLowerCase()], data.department);
                    departmentNode.w = 250;
                    departmentNode.h = 50;

                    args.nodes[departmentNode.id] = departmentNode;
                    departmentNodes.push(departmentNode);

                    var index = node.parent.children.indexOf(node);
                    node.parent.children.splice(index, 1);
                    node.parent.children.push(departmentNode);
                    departmentNode.parent = node.parent;
                    node.parent = departmentNode;
                    departmentNode.children.push(node);
                }
                else {
                    var index = node.parent.children.indexOf(node);
                    node.parent.children.splice(index, 1);
                    node.parent = departmentNode;
                    departmentNode.children.push(node);
                }
            }
        }
    }

    for (var i = 0; i < departmentNodes.length; i++) {
        var departmentNode = departmentNodes[i];
        var totalCount = 0;
        for (var j = 0; j < departmentNode.children.length; j++) {
            var cnode = departmentNode.children[j];
            totalCount += childrenTotalCount(cnode, args.nodes, departmentNode.id);
        }

        OrgChart.templates[departmentNode.id].node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#039BE5" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect><text x="10" y="30" style="font-size: 18px" fill="#2A292E" text-anchor="start">${departmentNode.id}</text><text x="240" y="30" style="font-size: 18px" fill="#2A292E" text-anchor="end">${totalCount}</text><line x1="2.5" y1="1" x2="247.5" y2="1" stroke-width="2" stroke="#039BE5"></line>`;
    }
});



var childrenTotalCount = function (node, nodes, department) {
    var count = 0;

    node.tags.push(department.toLowerCase());
    for (var i = 0; i < node.childrenIds.length; i++) {
        var cnode = nodes[node.childrenIds[i]];

        if (cnode) {
            count++;
            count += childrenTotalCount(cnode, nodes, department);
        }
    }

    return count;
};

chart.on('renderbuttons', function (sender, args) {
    var childrenTotalCount = OrgChart.childrenTotalCount(sender, args.node);


    if (args.node.tags.has('department') || (args.node.tags.has('node-with-subtrees') && args.node.min == false)) {
        args.html = '';
    }
    else if (childrenTotalCount > 0) {
        var html = OrgChart.expcollOpenTag
            .replace("{id}", args.node.id)
            .replace("{x}", args.node.x + 200)
            .replace("{y}", args.node.y + 90);

        var arrow;

        var collapsedChildrenIds = sender.getCollapsedIds(args.node);

        if (collapsedChildrenIds.length) {
            arrow = `
                <line x1="25" y1="7" x2="30" y2="15" stroke-width="1" stroke="#2A292E" />
                <line x1="30" y1="15" x2="35" y2="7" stroke-width="1" stroke="#2A292E" />`;
        }
        else {
            arrow = `
                <line x1="25" y1="15" x2="30" y2="7" stroke-width="1" stroke="#2A292E" />
                <line x1="30" y1="7" x2="35" y2="15" stroke-width="1" stroke="#2A292E" />`;
        }

        html += `<rect x="0" y="0" width="44" height="22" stroke="#aeaeae" stroke-width="1" fill="#ffffff" rx="5" ry="5"></rect>
                <text x="12" y="16" text-anchor="middle" style="font-size: 14px;" fill="#2A292E">${childrenTotalCount}</text>${arrow}
                <rect x="0" y="0" width="44" height="22" style="opacity: 0" stroke="#aeaeae" stroke-width="1" fill="red" rx="5" ry="5"></rect>`;
        html += OrgChart.grCloseTag;
        args.html = html;
    }

    if (args.node.tags.has('node-with-subtrees')) {
        var x = args.node.x + 170;
        var y = args.node.y + 90;
        if (args.node.min == false && args.node.stChildren.length) {
            x = args.node.stChildren[0].x + 170;
            y = args.node.stChildren[0].y + 90;
        }
        args.html += `<g transform="matrix(1,0,0,1,${x},${y})"><rect x="0" y="0" width="22" height="22" stroke="#aeaeae" stroke-width="1" fill="#ffffff" rx="5" ry="5"></rect>
                <text x="11" y="16" text-anchor="middle" style="font-size: 14px;" fill="#2A292E">1</text>
                <rect x="0" y="0" width="22" height="22" style="opacity: 0" stroke="#aeaeae" stroke-width="1" fill="red" rx="5" ry="5"></rect></g>`;
    }
});


chart.onNodeClick(function (args) {
    if (args.node.tags.has('department')) {
        return false;
    }
    if (args.node.tags.has('node-with-subtrees')) {
        if (args.node.min == false) {
            this.minimize(args.node.id);
            return false;
        }
    }
})


chart.load(nodes);
