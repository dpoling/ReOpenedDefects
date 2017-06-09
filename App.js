var app = null;

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<p>Re-opened Defects</p>'},
    launch: function() {
        //Write app code here
        app = this;
        var store = this.getSnapshotStore();
        console.log("After getSnapshotStore", store);

        this.grid = Ext.create('Rally.ui.grid.Grid',{
            // xtype: 'rallygrid',
             store : store,
             columnCfgs: [
                {dataIndex:'_UnformattedID',text:"ID"},
                {dataIndex:'ScheduleState',text:"To State"},

                 {text:"From State", renderer : function(v,m,r) {
                 	//return r.get("_PreviousValues").State;
                    return r.get("_PreviousValues").ScheduleState;
                 }},
                 //{dataIndex:'State',text:"State"},
                 //{dataIndex:'ScheduleState',text:"State"},
                 {dataIndex:'Priority',text:"Priority"},
                 {dataIndex:'Severity',text:"Severity"},
                 {dataIndex:'_ValidFrom',text:"Valid From", renderer: function(value) {
                 	return Rally.util.DateTime.fromIsoString(value);
                 }},
                  {dataIndex:'_ValidTo',text:"Valid To", renderer: function(value) {
                    return Rally.util.DateTime.fromIsoString(value);
                 }}

             ]
        });
        console.log("After create grid");

        this.add(this.grid);
        console.log("After add grid");

        this.grid.reconfigure(store);
        console.log("After reconfigure store");
        
        store.loadPage(1);
        console.log("After loadpage(1)")

    },

    getSnapshotStore : function() {

        var fetch = ['ObjectID','_UnformattedID','ScheduleState','State','Priority','Severity','_ItemHierarchy','_TypeHierarchy','_ValidFrom','_PreviousValues'];
        var hydrate = ['_TypeHierarchy','State','Priority','Severity','_PreviousValues','ScheduleState'];
        var find = {
                '_TypeHierarchy' : { "$in" : ["Defect","HierarchicalRequirement"]} ,
                '_ProjectHierarchy' : { "$in": app.getContext().getProject().ObjectID },
                'ScheduleState' : { "$in" : ["In-Progress", "New"]},
                '_PreviousValues.ScheduleState' : { "$in" : ["Completed","Accepted"]}
        };

        console.log("After find");
        
        var storeConfig = {
            find : find,
            showPagingToolbar: true,
            pageSize : 25,
            limit: 'Infinity',
            fetch: fetch,
            hydrate: hydrate,
            listeners : {
                scope : this,
                load: function(store, snapshots, success) {
                    console.log("completed snapshots:", snapshots.length);
                }
            }
        };

        console.log("After StoreConfig");

        var snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', storeConfig);

        console.log("After create Snapshot store");
        
        return snapshotStore;

    }


});
