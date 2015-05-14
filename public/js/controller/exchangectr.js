/**
 * Created by john on 2015/5/13.
 */
app.controller('exchangectr', function ($scope, $location) {
        $scope.selectedIndex = 0;
        $scope.itemClicked = function ($index) {
            $scope.selectedIndex = $index;
        }

        $scope.exchanges = [{
            "id": 1,
            "name": "beat-ad.cn",
            "pv":15400,
            "uv": 213
        }, {
            "id": 2,
            "name": "perfect-cn.cn",
            "pv":4544,
            "uv": 213
        }
        ];
        $scope.isCollapsed = false;
        $scope.treeclose = true;
    }
)