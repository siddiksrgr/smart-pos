var controller = new Vue({
    el: "#controller",
    data: {
        datas: [],
        data: {},
        actionUrl,
        apiUrl,
        editStatus: false,
        errors: [],
        errorStatus: false,
    },
    mounted: function () {
        this.datatable();
    },
    methods: {
        datatable() {
            const _this = this;
            _this.table = $("#datatable")
                .DataTable({
                    dom: "Bfrtip",
                    buttons: [
                        {
                            extend: "print",
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                        {
                            extend: "pdf",
                            exportOptions: {
                                columns: ":visible",
                            },
                        },
                        "colvis",
                    ],
                    ajax: {
                        url: _this.apiUrl,
                        type: "GET",
                    },
                    columns,
                })
                .on("xhr", function () {
                    _this.datas = _this.table.ajax.json().data;
                });
        },
        addData() {
            this.data = {};
            this.editStatus = false;
            this.errorStatus = false;
            $("#modal-default").modal();
        },
        editData(event, row) {
            this.data = this.datas[row];
            this.editStatus = true;
            this.errorStatus = false;
            $("#modal-default").modal();
        },
        deleteData(event, id) {
            if (confirm("Are you sure to delete?")) {
                axios
                    .post(this.actionUrl + "/" + id, { _method: "DELETE" })
                    .then((response) => {
                        $(event.target).parents("tr").remove();
                        this.table.ajax.reload();
                    })
                    .catch((error) => {
                        alert("Cannot delete data");
                    });
            }
        },
        submitForm(event, id) {
            const _this = this;
            var actionUrl = !this.editStatus
                ? this.actionUrl
                : this.actionUrl + "/" + id;
            axios
                .post(actionUrl, new FormData($(event.target)[0]))
                .then((response) => {
                    $("#modal-default").modal("hide");
                    _this.table.ajax.reload();
                })
                .catch((error) => {
                    this.errorStatus = true;
                    this.errors = error.response.data.errors;
                });
        },
        alertHide() {
            this.errorStatus = !this.errorStatus;
        },
        formatRupiah(x) {
            return Number(x).toLocaleString("id-ID");
        },
    },
});
